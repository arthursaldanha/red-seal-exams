"use client";

import { useQuery } from "@tanstack/react-query";

import { courseService } from "@/services";

export function useCourseDetail(courseIdOrSlug: string) {
  return useQuery({
    queryKey: ["course", courseIdOrSlug],
    queryFn: () => courseService.getBySlug(courseIdOrSlug),
    enabled: !!courseIdOrSlug,
  });
}

export function useCourseAccess(courseId: string) {
  const { data, ...rest } = useCourseDetail(courseId);
  return {
    data: data?.access ?? null,
    ...rest,
  };
}
