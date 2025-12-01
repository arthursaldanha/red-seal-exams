"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import type { QuestionOption, UserQuestionAttempt } from "@/types/dashboard";

import { UnansweredOption } from "./unanswered-option";
import { AnsweredOption } from "./answered-option";

type QuestionCardProps = {
  question: {
    id: string;
    stem: string;
    options: QuestionOption[];
    userAttempt: UserQuestionAttempt | null;
  };
  questionNumber: number;
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
  onConfirmAnswer: () => void;
  isSubmitting: boolean;
  localAnswer: { selectedOptionId: string; isCorrect: boolean } | null;
};

export function QuestionCard({
  question,
  questionNumber,
  selectedOption,
  onSelectOption,
  onConfirmAnswer,
  isSubmitting,
  localAnswer,
}: QuestionCardProps) {
  const isAnswered = !!question.userAttempt || !!localAnswer;
  const answerData =
    localAnswer ||
    (question.userAttempt
      ? {
          selectedOptionId: question.userAttempt.selectedOptionId,
          isCorrect: question.userAttempt.isCorrect,
        }
      : null);

  return (
    <div className="space-y-4">
      {/* Question header */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono">
          Question {questionNumber}
        </Badge>
        {isAnswered && (
          <Badge
            variant={answerData?.isCorrect ? "default" : "destructive"}
            className={answerData?.isCorrect ? "bg-green-500" : ""}
          >
            {answerData?.isCorrect ? "Correct" : "Incorrect"}
          </Badge>
        )}
      </div>

      {/* Question stem */}
      <Card>
        <CardContent className="pt-4">
          <p className="text-lg leading-relaxed">{question.stem}</p>
        </CardContent>
      </Card>

      {/* Options */}
      {!isAnswered ? (
        <div className="space-y-4">
          <RadioGroup
            value={selectedOption || ""}
            onValueChange={onSelectOption}
            className="gap-3"
          >
            {question.options.map((option, index) => (
              <UnansweredOption
                key={option.id}
                option={option}
                index={index}
                isSelected={selectedOption === option.id}
                onSelect={() => onSelectOption(option.id)}
              />
            ))}
          </RadioGroup>

          <Button
            onClick={onConfirmAnswer}
            disabled={!selectedOption || isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Submitting..." : "Confirm Answer"}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <AnsweredOption
              key={option.id}
              option={option}
              index={index}
              isSelected={answerData?.selectedOptionId === option.id}
              isCorrectAnswer={option.isCorrect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
