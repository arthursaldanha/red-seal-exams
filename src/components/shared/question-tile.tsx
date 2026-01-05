import { IconLock } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

type QuestionTileProps = {
  questionNumber: number;
  status: "correct" | "incorrect" | "unanswered";
  isLocked: boolean;
};

export function QuestionTile({
  questionNumber,
  status,
  isLocked,
}: QuestionTileProps) {
  const baseClasses =
    "aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-colors border w-10 h-10";

  if (isLocked) {
    return (
      <div
        className={cn(
          baseClasses,
          "bg-muted/50 border-muted-foreground/20 text-muted-foreground/50 group relative cursor-not-allowed"
        )}
        title="Purchase this course to unlock"
      >
        <span className="transition-opacity group-hover:opacity-0">
          {questionNumber}
        </span>
        <IconLock className="absolute h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    );
  }

  const statusClasses = {
    correct: "bg-green-500/10 border-green-500/30 text-green-600",
    incorrect: "bg-red-500/10 border-red-500/30 text-red-600",
    unanswered: "bg-background border-border",
  };

  return (
    <div className={cn(baseClasses, statusClasses[status])}>
      {questionNumber}
    </div>
  );
}
