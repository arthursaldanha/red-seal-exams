"use client";

import { use } from "react";

import { CourseDetailView } from "@/modules/courses/view";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  return <CourseDetailView courseId={courseId} />;
}
