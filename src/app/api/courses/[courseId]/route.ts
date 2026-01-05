import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import {
  course,
  block,
  task,
  subtask,
  question,
  userQuestionAttempt,
} from "@/db/schema";
import { eq, sql, and, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkCourseAccess } from "@/lib/access-control";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId: courseIdOrSlug } = await params;

    // Executar auth e busca do curso em paralelo
    const [session, courseById] = await Promise.all([
      auth.api.getSession({ headers: await headers() }),
      db.select().from(course).where(eq(course.id, courseIdOrSlug)).limit(1),
    ]);

    // Tentar por slug se não encontrou por ID
    let courseData = courseById;
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

    // Buscar todos os dados em paralelo (apenas 4 queries!)
    const [blocks, allTasks, questionCounts, access] = await Promise.all([
      // 1. Todos os blocks do curso
      db
        .select({
          id: block.id,
          code: block.code,
          title: block.title,
          description: block.description,
          order: block.order,
        })
        .from(block)
        .where(eq(block.courseId, courseId))
        .orderBy(block.order),

      // 2. Todas as tasks de todos os blocks do curso (com JOIN)
      db
        .select({
          id: task.id,
          blockId: task.blockId,
          code: task.code,
          title: task.title,
          order: task.order,
        })
        .from(task)
        .innerJoin(block, eq(task.blockId, block.id))
        .where(eq(block.courseId, courseId))
        .orderBy(task.blockId, task.order),

      // 3. Contagem de questões por block (uma única query agregada)
      db
        .select({
          blockId: question.blockId,
          count: sql<number>`count(*)::int`,
        })
        .from(question)
        .where(eq(question.courseId, courseId))
        .groupBy(question.blockId),

      // 4. Verificar acesso do usuário
      session?.user ? checkCourseAccess(session.user.id, courseId) : null,
    ]);

    // Buscar subtasks em uma única query (se houver tasks)
    const taskIds = allTasks.map((t) => t.id);
    const allSubtasks =
      taskIds.length > 0
        ? await db
            .select({
              id: subtask.id,
              taskId: subtask.taskId,
              code: subtask.code,
              title: subtask.title,
              order: subtask.order,
            })
            .from(subtask)
            .where(inArray(subtask.taskId, taskIds))
            .orderBy(subtask.taskId, subtask.order)
        : [];

    // Buscar progresso do usuário em uma única query (se logado)
    const userAttemptsByBlock: Map<
      string,
      { attempted: number; correct: number }
    > = new Map();
    if (session?.user) {
      const blockIds = blocks.map((b) => b.id);
      if (blockIds.length > 0) {
        const attempts = await db
          .select({
            blockId: question.blockId,
            isCorrect: userQuestionAttempt.isCorrect,
          })
          .from(userQuestionAttempt)
          .innerJoin(question, eq(question.id, userQuestionAttempt.questionId))
          .where(
            and(
              eq(userQuestionAttempt.userId, session.user.id),
              inArray(question.blockId, blockIds)
            )
          );

        // Agregar por block
        for (const attempt of attempts) {
          if (!attempt.blockId) continue;
          const current = userAttemptsByBlock.get(attempt.blockId) || {
            attempted: 0,
            correct: 0,
          };
          current.attempted++;
          if (attempt.isCorrect) current.correct++;
          userAttemptsByBlock.set(attempt.blockId, current);
        }
      }
    }

    // Criar maps para lookup rápido
    const questionCountByBlock = new Map(
      questionCounts.map((q) => [q.blockId, q.count])
    );
    const tasksByBlock = new Map<string, typeof allTasks>();
    for (const t of allTasks) {
      const existing = tasksByBlock.get(t.blockId) || [];
      existing.push(t);
      tasksByBlock.set(t.blockId, existing);
    }
    const subtasksByTask = new Map<string, typeof allSubtasks>();
    for (const s of allSubtasks) {
      const existing = subtasksByTask.get(s.taskId) || [];
      existing.push(s);
      subtasksByTask.set(s.taskId, existing);
    }

    // Montar resposta final (sem queries adicionais!)
    const blocksWithDetails = blocks.map((b) => {
      const blockTasks = tasksByBlock.get(b.id) || [];
      const questionCount = questionCountByBlock.get(b.id) || 0;
      const progress = userAttemptsByBlock.get(b.id);

      return {
        ...b,
        questionCount,
        tasks: blockTasks.map((t) => ({
          id: t.id,
          code: t.code,
          title: t.title,
          order: t.order,
          subtasks: subtasksByTask.get(t.id) || [],
        })),
        userProgress: progress
          ? {
              attempted: progress.attempted,
              correct: progress.correct,
              total: questionCount,
            }
          : null,
      };
    });

    const totalQuestions = blocksWithDetails.reduce(
      (acc, b) => acc + b.questionCount,
      0
    );

    return NextResponse.json({
      course: courseData[0],
      blocks: blocksWithDetails,
      totalQuestions,
      access,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
