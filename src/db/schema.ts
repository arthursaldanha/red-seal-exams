import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

/* ============================================================================
 * AUTH / USERS (SEU SCHEMA ORIGINAL)
 * ==========================================================================*/

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role").default("guest").notNull(), // "guest" | "user" | "admin"
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_user_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_user_idx").on(table.userId)]
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

/* ============================================================================
 * CURSOS / CONTEÚDO (COURSE → BLOCK → TASK → SUBTASK → QUESTION)
 * ==========================================================================*/

export const course = pgTable("course", {
  id: text("id").primaryKey(), // pode ser UUID/CUID gerado na app
  slug: text("slug").notNull().unique(), // "heavy-duty-red-seal"
  name: text("name").notNull(), // "Heavy Duty Equipment Technician"
  description: text("description"),
  price: integer("price_cents").notNull(),
  currency: text("currency").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const block = pgTable(
  "block",
  {
    id: text("id").primaryKey(),
    courseId: text("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    code: text("code").notNull(), // "A", "B", etc.
    title: text("title").notNull(), // "Common occupational skills"
    description: text("description"),
    order: integer("order").notNull(), // 1, 2, 3...
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("block_course_idx").on(table.courseId),
    index("block_course_order_idx").on(table.courseId, table.order),
  ]
);

export const task = pgTable(
  "task",
  {
    id: text("id").primaryKey(),
    blockId: text("block_id")
      .notNull()
      .references(() => block.id, { onDelete: "cascade" }),
    code: text("code").notNull(), // "A-1", etc.
    title: text("title").notNull(), // "Uses and maintains tools and equipment."
    description: text("description"),
    order: integer("order").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("task_block_idx").on(table.blockId),
    index("task_block_order_idx").on(table.blockId, table.order),
  ]
);

export const subtask = pgTable(
  "subtask",
  {
    id: text("id").primaryKey(),
    taskId: text("task_id")
      .notNull()
      .references(() => task.id, { onDelete: "cascade" }),
    code: text("code").notNull(), // "A-1.01"
    title: text("title").notNull(), // "Maintains tools and equipment"
    description: text("description"),
    order: integer("order").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("subtask_task_idx").on(table.taskId),
    index("subtask_task_order_idx").on(table.taskId, table.order),
  ]
);

/* ============================================================================
 * QUESTIONS (SEM DEPENDER DE A/B/C/D)
 * ==========================================================================*/

export type QuestionOption = {
  id: string; // "opt_1", "opt_2", etc (por questão)
  text: string; // texto da alternativa
  explanation: string; // explicação do porquê está certa/errada
  isCorrect: boolean; // true para a alternativa correta
};

export const question = pgTable(
  "question",
  {
    id: text("id").primaryKey(),

    // Ligações de conteúdo
    courseId: text("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    blockId: text("block_id").references(() => block.id, {
      onDelete: "set null",
    }),
    taskId: text("task_id").references(() => task.id, {
      onDelete: "set null",
    }),
    subtaskId: text("subtask_id").references(() => subtask.id, {
      onDelete: "set null",
    }),

    // Enunciado
    stem: text("stem").notNull(),

    // Array de alternativas (sem A/B/C/D fixo)
    options: jsonb("options").$type<QuestionOption[]>().notNull(),

    isActive: boolean("is_active").default(true).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("question_course_idx").on(table.courseId),
    index("question_block_idx").on(table.blockId),
    index("question_task_idx").on(table.taskId),
    index("question_subtask_idx").on(table.subtaskId),
  ]
);

/* ============================================================================
 * EXAMS (SIMULADOS FIXOS POR TRADE)
 * ==========================================================================*/

export const exam = pgTable(
  "exam",
  {
    id: text("id").primaryKey(),
    courseId: text("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    title: text("title").notNull(), // "Mock Exam #1 - Heavy Duty"
    description: text("description"),
    durationMinutes: integer("duration_minutes"), // opcional
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("exam_course_idx").on(table.courseId)]
);

// Relação N:N entre exam e question
export const examQuestion = pgTable(
  "exam_question",
  {
    examId: text("exam_id")
      .notNull()
      .references(() => exam.id, { onDelete: "cascade" }),
    questionId: text("question_id")
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    order: integer("order").notNull(), // posição da questão no simulado
  },
  (table) => [
    index("exam_question_exam_idx").on(table.examId),
    index("exam_question_question_idx").on(table.questionId),
  ]
);

/* ============================================================================
 * QUIZ SESSION (SESSÕES DE ESTUDO / SIMULADO)
 * ==========================================================================*/

export const quizSession = pgTable(
  "quiz_session",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    courseId: text("course_id").references(() => course.id, {
      onDelete: "set null",
    }),
    examId: text("exam_id").references(() => exam.id, {
      onDelete: "set null",
    }), // se a sessão veio de um exam fixo

    title: text("title"), // "Simulado Block A", "Mock Exam #1", etc.
    mode: text("mode"), // "practice" | "exam" (opcional)

    startedAt: timestamp("started_at").defaultNow().notNull(),
    finishedAt: timestamp("finished_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("quiz_session_user_idx").on(table.userId),
    index("quiz_session_course_idx").on(table.courseId),
  ]
);

/* ============================================================================
 * USER QUESTION ATTEMPTS (RESPOSTAS DO USUÁRIO)
 * ==========================================================================*/

export const userQuestionAttempt = pgTable(
  "user_question_attempt",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    questionId: text("question_id")
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),

    quizSessionId: text("quiz_session_id").references(() => quizSession.id, {
      onDelete: "set null",
    }),

    // "opt_1", "opt_2"... (ID canônico da alternativa dentro da questão)
    selectedOptionId: text("selected_option_id").notNull(),

    isCorrect: boolean("is_correct").notNull(),

    responseTimeMs: integer("response_time_ms"),
    attemptedAt: timestamp("attempted_at").defaultNow().notNull(),
  },
  (table) => [
    index("uqa_user_idx").on(table.userId),
    index("uqa_question_idx").on(table.questionId),
    index("uqa_user_question_idx").on(table.userId, table.questionId),
  ]
);

/* ============================================================================
 * USER TRIAL (TRIAL GLOBAL - 7 DIAS PARA TODA PLATAFORMA)
 * ==========================================================================*/

export const userTrial = pgTable("user_trial", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(), // startedAt + 7 dias
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ============================================================================
 * USER COURSE (CURSOS COMPRADOS)
 * ==========================================================================*/

export const userCourse = pgTable(
  "user_course",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    courseId: text("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    purchasedAt: timestamp("purchased_at").defaultNow().notNull(),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("uc_user_idx").on(table.userId),
    index("uc_course_idx").on(table.courseId),
  ]
);

/* ============================================================================
 * EXPORT DO SCHEMA COMPLETO
 * ==========================================================================*/

export const schema = {
  user,
  session,
  account,
  verification,

  course,
  block,
  task,
  subtask,
  question,

  exam,
  examQuestion,

  quizSession,
  userQuestionAttempt,

  userTrial,
  userCourse,
};
