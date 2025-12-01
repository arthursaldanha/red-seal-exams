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
              "w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors border relative group",
              statusClasses.locked
            )}
          >
            <span className="group-hover:opacity-0 transition-opacity">
              {number}
            </span>
            <IconLock className="h-3.5 w-3.5 absolute opacity-0 group-hover:opacity-100 transition-opacity" />
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
        "w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors border",
        statusClasses[status],
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      {number}
    </button>
  );
}
