"use client";

import { use } from "react";

import { BlockQuestionsView } from "@/modules/blocks/view";

export default function BlockQuestionsPage({
  params,
}: {
  params: Promise<{ courseId: string; blockId: string }>;
}) {
  const { courseId, blockId } = use(params);
  return <BlockQuestionsView courseId={courseId} blockId={blockId} />;
}
