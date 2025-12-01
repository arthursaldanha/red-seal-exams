import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { course, question, block, userQuestionAttempt } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkCourseAccess } from "@/lib/access-control";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string; blockId: string }> }
) {
  try {
    const { courseId: courseIdOrSlug, blockId } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolver curso por ID ou slug
    let courseData = await db
      .select()
      .from(course)
      .where(eq(course.id, courseIdOrSlug))
      .limit(1);

    if (courseData.length === 0) {
      courseData = await db
        .select()
        .from(course)
        .where(eq(course.slug, courseIdOrSlug))
        .limit(1);
    }

    if (courseData.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const courseId = courseData[0].id;

    // Verificar se o block pertence ao curso
    const blockData = await db
      .select()
      .from(block)
      .where(and(eq(block.id, blockId), eq(block.courseId, courseId)))
      .limit(1);

    if (blockData.length === 0) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    const currentBlock = blockData[0];
    const isBlockA = currentBlock.code === "A";

    // Verificar acesso
    const access = await checkCourseAccess(session.user.id, courseId);

    // Trial expirado = sem acesso
    if (!access.hasAccess) {
      return NextResponse.json(
        {
          error: "Access denied",
          trialExpired: access.trialExpired,
          message: "Your trial has expired. Please purchase the course to continue.",
        },
        { status: 403 }
      );
    }

    // Trial só tem acesso ao Block A
    const isTrial = access.accessType === "trial";
    const blockLockedForTrial = isTrial && access.blockAOnly && !isBlockA;

    // Buscar TODAS as questões do bloco (sem paginação)
    const questions = await db
      .select()
      .from(question)
      .where(eq(question.blockId, blockId))
      .orderBy(question.id);

    const totalQuestions = questions.length;

    // Buscar attempts do usuário para essas questões
    const questionIds = questions.map((q) => q.id);
    const attempts = await db
      .select()
      .from(userQuestionAttempt)
      .where(
        and(
          eq(userQuestionAttempt.userId, session.user.id),
          sql`${userQuestionAttempt.questionId} IN (${sql.join(
            questionIds.map((id) => sql`${id}`),
            sql`, `
          )})`
        )
      );

    // Mapear attempts por questionId (pegar o mais recente)
    const attemptsByQuestion = new Map<string, typeof attempts[0]>();
    for (const attempt of attempts) {
      const existing = attemptsByQuestion.get(attempt.questionId);
      if (!existing || attempt.attemptedAt > existing.attemptedAt) {
        attemptsByQuestion.set(attempt.questionId, attempt);
      }
    }

    // Adicionar attempt info e isLocked às questões
    const questionsLimit = access.questionsLimit ?? totalQuestions;
    const questionsWithAttempts = questions.map((q, index) => {
      // Questão está bloqueada se:
      // 1. Block não é A e usuário é trial, OU
      // 2. É Block A mas passou do limite de 20 questões
      const isLocked = blockLockedForTrial || (isTrial && isBlockA && index >= questionsLimit);

      return {
        ...q,
        userAttempt: attemptsByQuestion.get(q.id) ?? null,
        isLocked,
      };
    });

    // Calcular estatísticas (apenas questões não bloqueadas)
    const answered = attempts.length;
    const correct = attempts.filter((a) => a.isCorrect).length;

    // Calcular quantas questões estão acessíveis
    const accessibleQuestions = isTrial
      ? (isBlockA ? Math.min(questionsLimit, totalQuestions) : 0)
      : totalQuestions;

    return NextResponse.json({
      block: currentBlock,
      questions: questionsWithAttempts,
      totalQuestions,
      accessibleQuestions,
      access: {
        ...access,
        blockLockedForTrial,
        isBlockA,
      },
      stats: {
        answered,
        correct,
        accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
