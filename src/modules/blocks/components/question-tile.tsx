import { IconLock } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type QuestionTileProps = {
  number: number;
  status: "correct" | "incorrect" | "unanswered";
  isSelected: boolean;
  isLocked: boolean;
  onClick: () => void;
};

export function QuestionTile({
  number,
  status,
  isSelected,
  isLocked,
  onClick,
}: QuestionTileProps) {
  const statusClasses = {
    correct: "bg-green-500/10 border-green-500/30 text-green-600",
    incorrect: "bg-red-500/10 border-red-500/30 text-red-600",
    unanswered: "bg-background border-border hover:bg-muted/50",
    locked:
      "bg-muted/50 border-border text-muted-foreground/50 cursor-not-allowed",
  };

  if (isLocked) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "group relative flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
              statusClasses.locked
            )}
          >
            <span className="transition-opacity group-hover:opacity-0">
              {number}
            </span>
            <IconLock className="absolute h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Purchase this course to unlock</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
        statusClasses[status],
        isSelected && "ring-primary ring-2 ring-offset-2"
      )}
    >
      {number}
    </button>
  );
}
