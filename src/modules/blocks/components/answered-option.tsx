import { IconCheck, IconX } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import type { QuestionOption } from "@/types/dashboard";

type AnsweredOptionProps = {
  option: QuestionOption;
  index: number;
  isSelected: boolean;
  isCorrectAnswer: boolean;
};

export function AnsweredOption({
  option,
  index,
  isSelected,
  isCorrectAnswer,
}: AnsweredOptionProps) {
  const letter = String.fromCharCode(65 + index);

  let borderClass = "border-border";
  let bgClass = "bg-background";
  let iconComponent = null;

  if (isSelected && isCorrectAnswer) {
    borderClass = "border-green-500";
    bgClass = "bg-green-500/10";
    iconComponent = (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500">
        <IconCheck className="h-4 w-4 text-white" />
      </div>
    );
  } else if (isSelected && !isCorrectAnswer) {
    borderClass = "border-red-500";
    bgClass = "bg-red-500/10";
    iconComponent = (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500">
        <IconX className="h-4 w-4 text-white" />
      </div>
    );
  } else if (isCorrectAnswer) {
    borderClass = "border-green-500/50";
    bgClass = "bg-green-500/5";
    iconComponent = (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-green-500">
        <IconCheck className="h-3 w-3 text-green-500" />
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border p-3", borderClass, bgClass)}>
      <div className="flex items-start gap-3">
        {iconComponent || <div className="w-6 shrink-0" />}
        <div className="min-w-0 flex-1">
          <p className="font-medium">
            <span className="mr-2 font-semibold">{letter})</span>
            {option.text}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {option.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
