import type { QuestionsApiResponse, AttemptApiResponse } from "@/types/dashboard";

import { api } from "./api";
import type { IQuestionService, SubmitAttemptParams } from "./interfaces";

class QuestionService implements IQuestionService {
  async getByBlock(
    courseId: string,
    blockId: string
  ): Promise<QuestionsApiResponse> {
    const { data } = await api.get<QuestionsApiResponse>(
      `/courses/${courseId}/blocks/${blockId}/questions`
    );
    return data;
  }

  async submitAttempt(params: SubmitAttemptParams): Promise<AttemptApiResponse> {
    const { data } = await api.post<AttemptApiResponse>(
      `/questions/${params.questionId}/attempt`,
      {
        selectedOptionId: params.selectedOptionId,
        responseTimeMs: params.responseTimeMs,
        quizSessionId: params.quizSessionId,
      }
    );
    return data;
  }
}

export const questionService = new QuestionService();
