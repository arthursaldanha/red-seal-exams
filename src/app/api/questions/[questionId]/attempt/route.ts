import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { question, userQuestionAttempt } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkCourseAccess } from "@/lib/access-control";
import { init } from "@paralleldrive/cuid2";

const createId = init({ length: 24 });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params;
    const body = await request.json();
    const { selectedOptionId, responseTimeMs, quizSessionId } = body;

    if (!selectedOptionId) {
      return NextResponse.json(
        { error: "selectedOptionId is required" },
        { status: 400 }
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Buscar a questão
    const questionData = await db
      .select()
      .from(question)
      .where(eq(question.id, questionId))
      .limit(1);

    if (questionData.length === 0) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const questionInfo = questionData[0];

    // Verificar acesso ao curso
    const access = await checkCourseAccess(
      session.user.id,
      questionInfo.courseId
    );

    if (!access.hasAccess) {
      return NextResponse.json(
        {
          error: "Access denied",
          trialExpired: access.trialExpired,
          message: access.trialExpired
            ? "Your trial has expired. Please purchase the course to continue."
            : "You do not have access to this course.",
        },
        { status: 403 }
      );
    }

    // Verificar se a opção selecionada existe e se está correta
    const options = questionInfo.options;
    const selectedOption = options.find((opt) => opt.id === selectedOptionId);

    if (!selectedOption) {
      return NextResponse.json(
        { error: "Invalid option selected" },
        { status: 400 }
      );
    }

    const isCorrect = selectedOption.isCorrect;

    // Registrar a tentativa
    const attemptId = createId();
    await db.insert(userQuestionAttempt).values({
      id: attemptId,
      userId: session.user.id,
      questionId,
      quizSessionId: quizSessionId ?? null,
      selectedOptionId,
      isCorrect,
      responseTimeMs: responseTimeMs ?? null,
    });

    // Retornar resultado com explicações
    return NextResponse.json({
      attemptId,
      isCorrect,
      correctOptionId: options.find((opt) => opt.isCorrect)?.id,
      selectedOption: {
        id: selectedOption.id,
        text: selectedOption.text,
        explanation: selectedOption.explanation,
        isCorrect: selectedOption.isCorrect,
      },
      allOptions: options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        explanation: opt.explanation,
        isCorrect: opt.isCorrect,
      })),
    });
  } catch (error) {
    console.error("Error registering attempt:", error);
    return NextResponse.json(
      { error: "Failed to register attempt" },
      { status: 500 }
    );
  }
}
