import { db } from "@/db/drizzle";
import { userCourse, userTrial } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { init } from "@paralleldrive/cuid2";

const createId = init({ length: 16 });

export type AccessResult = {
  hasAccess: boolean;
  accessType: "owner" | "trial" | "none";
  questionsLimit: number | null; // null = sem limite
  trialExpiresAt: Date | null;
  trialDaysRemaining: number | null;
  trialExpired: boolean;
  blockAOnly: boolean; // trial = apenas Block A
};

const TRIAL_DAYS = 7;
const TRIAL_QUESTIONS_LIMIT = 20;

/**
 * Verifica se o usuário tem acesso a um curso específico
 */
export async function checkCourseAccess(
  userId: string,
  courseId: string
): Promise<AccessResult> {
  // 1. Verificar se comprou o curso
  const purchase = await db
    .select()
    .from(userCourse)
    .where(
      and(eq(userCourse.userId, userId), eq(userCourse.courseId, courseId))
    )
    .limit(1);

  if (purchase.length > 0) {
    return {
      hasAccess: true,
      accessType: "owner",
      questionsLimit: null,
      trialExpiresAt: null,
      trialDaysRemaining: null,
      trialExpired: false,
      blockAOnly: false,
    };
  }

  // 2. Verificar trial global
  const trial = await db
    .select()
    .from(userTrial)
    .where(eq(userTrial.userId, userId))
    .limit(1);

  const now = new Date();

  // 3. Se não tem trial, criar um
  if (trial.length === 0) {
    const expiresAt = new Date(
      now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000
    );
    await db.insert(userTrial).values({
      id: createId(),
      userId,
      startedAt: now,
      expiresAt,
    });

    return {
      hasAccess: true,
      accessType: "trial",
      questionsLimit: TRIAL_QUESTIONS_LIMIT,
      trialExpiresAt: expiresAt,
      trialDaysRemaining: TRIAL_DAYS,
      trialExpired: false,
      blockAOnly: true,
    };
  }

  // 4. Verificar se trial expirou
  const userTrialData = trial[0];
  const trialExpired = now > userTrialData.expiresAt;

  if (trialExpired) {
    return {
      hasAccess: false,
      accessType: "none",
      questionsLimit: 0,
      trialExpiresAt: userTrialData.expiresAt,
      trialDaysRemaining: 0,
      trialExpired: true,
      blockAOnly: true,
    };
  }

  // 5. Trial ainda válido
  const msRemaining = userTrialData.expiresAt.getTime() - now.getTime();
  const daysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));

  return {
    hasAccess: true,
    accessType: "trial",
    questionsLimit: TRIAL_QUESTIONS_LIMIT,
    trialExpiresAt: userTrialData.expiresAt,
    trialDaysRemaining: daysRemaining,
    trialExpired: false,
    blockAOnly: true,
  };
}

/**
 * Verifica se o usuário tem acesso geral à plataforma (trial ou comprou algo)
 */
export async function checkPlatformAccess(userId: string): Promise<{
  hasAccess: boolean;
  isTrialActive: boolean;
  trialDaysRemaining: number | null;
  purchasedCourses: string[];
}> {
  // Verificar cursos comprados
  const purchases = await db
    .select({ courseId: userCourse.courseId })
    .from(userCourse)
    .where(eq(userCourse.userId, userId));

  const purchasedCourses = purchases.map((p) => p.courseId);

  if (purchasedCourses.length > 0) {
    return {
      hasAccess: true,
      isTrialActive: false,
      trialDaysRemaining: null,
      purchasedCourses,
    };
  }

  // Verificar trial
  const trial = await db
    .select()
    .from(userTrial)
    .where(eq(userTrial.userId, userId))
    .limit(1);

  if (trial.length === 0) {
    // Sem trial ainda - será criado no primeiro acesso a um curso
    return {
      hasAccess: true,
      isTrialActive: true,
      trialDaysRemaining: TRIAL_DAYS,
      purchasedCourses: [],
    };
  }

  const now = new Date();
  const userTrialData = trial[0];
  const trialExpired = now > userTrialData.expiresAt;

  if (trialExpired) {
    return {
      hasAccess: false,
      isTrialActive: false,
      trialDaysRemaining: 0,
      purchasedCourses: [],
    };
  }

  const msRemaining = userTrialData.expiresAt.getTime() - now.getTime();
  const daysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));

  return {
    hasAccess: true,
    isTrialActive: true,
    trialDaysRemaining: daysRemaining,
    purchasedCourses: [],
  };
}

/**
 * Registra a compra de um curso
 */
export async function registerCoursePurchase(
  userId: string,
  courseId: string,
  stripePaymentIntentId?: string
): Promise<void> {
  await db.insert(userCourse).values({
    id: createId(),
    userId,
    courseId,
    stripePaymentIntentId: stripePaymentIntentId ?? null,
  });
}
