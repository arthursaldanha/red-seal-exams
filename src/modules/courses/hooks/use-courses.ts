"use client";

import { useQuery } from "@tanstack/react-query";

import { courseService } from "@/services";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => courseService.getAll(),
  });
}

export function usePlatformAccess() {
  const { data, ...rest } = useCourses();
  return {
    data: data?.platformAccess ?? null,
    ...rest,
  };
}
