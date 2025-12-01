// Types based on the database schema for the dashboard UI

export type QuestionOption = {
  id: string;
  text: string;
  explanation: string;
  isCorrect: boolean;
};

export type Course = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Block = {
  id: string;
  courseId: string;
  code: string;
  title: string;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Task = {
  id: string;
  blockId: string;
  code: string;
  title: string;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Subtask = {
  id: string;
  taskId: string;
  code: string;
  title: string;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Question = {
  id: string;
  courseId: string;
  blockId: string | null;
  taskId: string | null;
  subtaskId: string | null;
  stem: string;
  options: QuestionOption[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserQuestionAttempt = {
  id: string;
  userId: string;
  questionId: string;
  quizSessionId: string | null;
  selectedOptionId: string;
  isCorrect: boolean;
  responseTimeMs: number | null;
  attemptedAt: Date;
};

export type QuizSession = {
  id: string;
  userId: string;
  courseId: string | null;
  examId: string | null;
  title: string | null;
  mode: "practice" | "exam" | null;
  startedAt: Date;
  finishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// Analytics types
export type CourseAnalytics = {
  courseId: string;
  courseName: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  accuracyRate: number;
  avgResponseTimeMs: number;
};

export type BlockAnalytics = {
  blockId: string;
  blockCode: string;
  blockTitle: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  accuracyRate: number;
};

export type TaskAnalytics = {
  taskId: string;
  taskCode: string;
  taskTitle: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  accuracyRate: number;
};

export type OverallAnalytics = {
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracyRate: number;
  avgResponseTimeMs: number;
  activeCourses: number;
};

// Study planner types
export type StudyItemStatus = "to_study" | "in_progress" | "completed";

export type StudyItem = {
  id: string;
  title: string;
  subtitle: string | null;
  courseId: string | null;
  blockId: string | null;
  taskId: string | null;
  subtaskId: string | null;
  status: StudyItemStatus;
  progress: number;
  targetDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// Course detail types
export type CourseWithBlocks = Course & {
  blocks: (Block & {
    tasks: (Task & {
      subtasks: Subtask[];
    })[];
    questionCount: number;
  })[];
  totalQuestions: number;
  userProgress: {
    attemptedQuestions: number;
    correctAnswers: number;
    progressPercent: number;
  };
};

export type QuestionWithStatus = Question & {
  userAttempt?: {
    isCorrect: boolean;
    attemptedAt: Date;
  };
};

// User course access
export type UserCourse = Course & {
  purchasedAt: Date;
  progress: {
    attemptedQuestions: number;
    totalQuestions: number;
    correctAnswers: number;
    progressPercent: number;
  };
};

// Access control types
export type AccessResult = {
  hasAccess: boolean;
  accessType: "owner" | "trial" | "none";
  questionsLimit: number | null;
  trialExpiresAt: string | null;
  trialDaysRemaining: number | null;
  trialExpired: boolean;
};

export type PlatformAccess = {
  hasAccess: boolean;
  isTrialActive: boolean;
  trialDaysRemaining: number | null;
  purchasedCourses: string[];
};

// API Response types
export type CoursesApiResponse = {
  courses: (Course & {
    blockCount: number;
    questionCount: number;
    hasAccess: boolean;
    price: number;
    currency: string;
  })[];
  platformAccess: PlatformAccess | null;
};

export type CourseDetailApiResponse = {
  course: Course & {
    price: number;
    currency: string;
  };
  blocks: (Block & {
    tasks: (Task & {
      subtasks: Subtask[];
    })[];
    questionCount: number;
    userProgress: {
      attempted: number;
      correct: number;
      total: number;
    } | null;
  })[];
  totalQuestions: number;
  access: AccessResult | null;
};

export type QuestionsApiResponse = {
  block: Block;
  questions: (Question & {
    userAttempt: UserQuestionAttempt | null;
    isLocked: boolean;
  })[];
  totalQuestions: number;
  accessibleQuestions: number;
  access: AccessResult & {
    blockLockedForTrial: boolean;
    isBlockA: boolean;
  };
  stats: {
    answered: number;
    correct: number;
    accuracy: number;
  };
};

export type AttemptApiResponse = {
  attemptId: string;
  isCorrect: boolean;
  correctOptionId: string;
  selectedOption: QuestionOption;
  allOptions: QuestionOption[];
};
