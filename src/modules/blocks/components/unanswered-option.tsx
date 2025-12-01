import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { QuestionOption } from "@/types/dashboard";

type UnansweredOptionProps = {
  option: QuestionOption;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
};

export function UnansweredOption({
  option,
  index,
  isSelected,
  onSelect,
}: UnansweredOptionProps) {
  const letter = String.fromCharCode(65 + index);

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
      onClick={onSelect}
    >
      <RadioGroupItem value={option.id} id={option.id} className="mt-0.5" />
      <Label
        htmlFor={option.id}
        className="flex-1 cursor-pointer font-normal leading-relaxed"
      >
        <span className="font-semibold mr-2">{letter})</span>
        {option.text}
      </Label>
    </div>
  );
}
