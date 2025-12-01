import { IconClock } from "@tabler/icons-react";

type TrialBannerProps = {
  daysRemaining: number;
  questionsLimit?: number;
  variant?: "simple" | "detailed";
};

export function TrialBanner({
  daysRemaining,
  questionsLimit,
  variant = "simple",
}: TrialBannerProps) {
  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
      <IconClock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
          Free Trial: {daysRemaining} {daysRemaining === 1 ? "day" : "days"}{" "}
          remaining
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
          {variant === "detailed" && questionsLimit
            ? `You can access the first ${questionsLimit} questions of Block A only. Purchase this course to unlock all blocks and questions.`
            : "Access 15 questions per block. Purchase a course for full access."}
        </p>
      </div>
    </div>
  );
}
