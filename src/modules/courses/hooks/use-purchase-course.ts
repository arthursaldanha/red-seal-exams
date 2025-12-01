"use client";

import { useMutation } from "@tanstack/react-query";

import { courseService } from "@/services";

export function usePurchaseCourse() {
  return useMutation({
    mutationFn: (courseId: string) => courseService.purchase(courseId),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
}
