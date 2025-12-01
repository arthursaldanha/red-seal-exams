"use client";

import { useQuery } from "@tanstack/react-query";

import { questionService } from "@/services";

export function useBlockQuestions(courseId: string, blockId: string) {
  return useQuery({
    queryKey: ["questions", courseId, blockId],
    queryFn: () => questionService.getByBlock(courseId, blockId),
    enabled: !!courseId && !!blockId,
  });
}
