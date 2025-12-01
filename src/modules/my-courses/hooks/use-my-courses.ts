"use client";

import { useCourses } from "@/modules/courses/hooks";

export function useMyCourses() {
  const { data, ...rest } = useCourses();

  const myCourses = data?.courses.filter((c) => c.hasAccess) ?? [];

  return {
    data: myCourses,
    ...rest,
  };
}
