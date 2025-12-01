import type { QuestionsApiResponse, AttemptApiResponse } from "@/types/dashboard";

export type SubmitAttemptParams = {
  questionId: string;
  selectedOptionId: string;
  responseTimeMs?: number;
  quizSessionId?: string;
};

export interface IQuestionService {
  getByBlock(courseId: string, blockId: string): Promise<QuestionsApiResponse>;
  submitAttempt(params: SubmitAttemptParams): Promise<AttemptApiResponse>;
}
