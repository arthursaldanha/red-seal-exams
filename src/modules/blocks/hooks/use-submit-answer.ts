"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { questionService } from "@/services";
import type { SubmitAttemptParams } from "@/services";

export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SubmitAttemptParams) =>
      questionService.submitAttempt(params),
    onSuccess: () => {
      // Invalidate questions queries to refresh attempt status
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
  });
}
