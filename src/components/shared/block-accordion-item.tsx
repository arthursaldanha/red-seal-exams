"use client";

import Link from "next/link";
import { IconLock } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { QuestionTile } from "./question-tile";

type BlockAccordionItemProps = {
  block: {
    id: string;
    code: string;
    title: string;
    questionCount: number;
    userProgress: {
      attempted: number;
      correct: number;
      total: number;
    } | null;
  };
  courseSlug: string;
  hasAccess: boolean;
  accessType: "owner" | "trial" | "none";
  questionsLimit: number | null;
};

export function BlockAccordionItem({
  block,
  courseSlug,
  hasAccess,
  accessType,
  questionsLimit,
}: BlockAccordionItemProps) {
  const progress = block.userProgress;
  const isBlockA = block.code === "A";
  const isTrial = accessType === "trial";
  const isOwner = accessType === "owner";

  // Determine which questions are accessible:
  // - Owner: all questions in all blocks
  // - Trial: only first N questions in Block A, nothing in other blocks
  const accessibleQuestions = isOwner
    ? block.questionCount
    : isTrial && isBlockA
      ? Math.min(block.questionCount, questionsLimit ?? 0)
      : 0;

  // Can start studying only if there are accessible questions
  const canStartStudying = accessibleQuestions > 0;

  return (
    <AccordionItem value={block.id} className="mb-2 rounded-lg border px-4">
      <AccordionTrigger className="py-4 hover:no-underline">
        <div className="flex flex-wrap items-center gap-3 text-left">
          <Badge variant="outline" className="font-mono">
            Block {block.code}
          </Badge>
          <span className="font-medium">{block.title}</span>
          <Badge variant="secondary" className="ml-2">
            {block.questionCount} questions
          </Badge>
          {/* Trial badge only on Block A */}
          {isTrial && isBlockA && questionsLimit && (
            <Badge
              variant="outline"
              className="border-amber-500/30 text-amber-600"
            >
              {Math.min(questionsLimit, block.questionCount)} available in trial
            </Badge>
          )}
          {/* Locked badge for non-Block A in trial */}
          {isTrial && !isBlockA && (
            <Badge
              variant="outline"
              className="text-muted-foreground border-muted-foreground/30"
            >
              <IconLock className="mr-1 h-3 w-3" />
              Locked in trial
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        {/* Progress info */}
        {hasAccess && progress && progress.attempted > 0 && (
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <span>{progress.attempted} answered</span>
            <span>{progress.correct} correct</span>
            <span>
              {Math.round((progress.correct / progress.attempted) * 100)}%
              accuracy
            </span>
          </div>
        )}

        {/* Question tiles - show ALL questions */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-2">
          {Array.from({ length: block.questionCount }).map((_, i) => {
            // Question is locked if:
            // - Not owner AND (not Block A OR beyond the trial limit)
            const isLocked =
              !isOwner && (!isBlockA || i >= (questionsLimit ?? 0));

            return (
              <QuestionTile
                key={i}
                questionNumber={i + 1}
                status="unanswered"
                isLocked={isLocked}
              />
            );
          })}
        </div>

        {/* Start studying button - only if there are accessible questions */}
        {canStartStudying && (
          <Button asChild className="w-full sm:w-auto">
            <Link href={`/dashboard/courses/${courseSlug}/blocks/${block.id}`}>
              Start studying
            </Link>
          </Button>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
