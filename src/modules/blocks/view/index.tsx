"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBook,
  IconLock,
  IconClock,
  IconShoppingCart,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/dashboard/page-header";

import { usePurchaseCourse } from "@/modules/courses/hooks";

import { useBlockQuestions, useSubmitAnswer } from "../hooks";
import { QuestionTile, QuestionCard } from "../components";

type BlockQuestionsViewProps = {
  courseId: string;
  blockId: string;
};

export function BlockQuestionsView({
  courseId,
  blockId,
}: BlockQuestionsViewProps) {
  const searchParams = useSearchParams();
  const initialQuestion = parseInt(searchParams.get("q") || "0", 10);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(initialQuestion);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [localAnswers, setLocalAnswers] = useState<
    Map<string, { selectedOptionId: string; isCorrect: boolean }>
  >(new Map());

  const { data, isLoading, error } = useBlockQuestions(courseId, blockId);
  const submitMutation = useSubmitAnswer();
  const purchaseMutation = usePurchaseCourse();

  const questions = data?.questions ?? [];
  const totalQuestions = data?.totalQuestions ?? 0;
  const accessibleQuestions = data?.accessibleQuestions ?? 0;
  const access = data?.access;
  const block = data?.block;
  const stats = data?.stats;

  const hasAccess = access?.hasAccess ?? false;
  const isTrial = access?.accessType === "trial";
  const currentQuestion = questions[currentQuestionIndex];

  // Handle question navigation
  const handleQuestionChange = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
    setSelectedOption(null);
  }, []);

  // Handle answer submission
  const handleConfirmAnswer = useCallback(async () => {
    if (!selectedOption || !currentQuestion) return;

    try {
      const result = await submitMutation.mutateAsync({
        questionId: currentQuestion.id,
        selectedOptionId: selectedOption,
      });

      setLocalAnswers((prev) => {
        const newMap = new Map(prev);
        newMap.set(currentQuestion.id, {
          selectedOptionId: selectedOption,
          isCorrect: result.isCorrect,
        });
        return newMap;
      });
      setSelectedOption(null);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  }, [selectedOption, currentQuestion, submitMutation]);

  // Navigate to next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      handleQuestionChange(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions.length, handleQuestionChange]);

  // Navigate to previous question
  const handlePrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      handleQuestionChange(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, handleQuestionChange]);

  // Check if current question is answered
  const isCurrentAnswered =
    !!currentQuestion?.userAttempt ||
    localAnswers.has(currentQuestion?.id ?? "");

  // Loading state
  if (isLoading) {
    return (
      <>
        <PageHeader title="Loading..." />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-3xl animate-pulse flex-col gap-4 p-6">
            <div className="bg-muted h-8 w-32 rounded" />
            <div className="bg-muted h-32 rounded-lg" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-muted h-16 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error or no access
  if (error || !hasAccess) {
    const isTrialExpired = access?.trialExpired;

    return (
      <>
        <PageHeader title="Access Denied" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
          <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
            <IconLock className="text-muted-foreground h-10 w-10" />
          </div>
          <div className="max-w-md text-center">
            <h2 className="text-xl font-semibold">
              {isTrialExpired ? "Trial Expired" : "Access Denied"}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isTrialExpired
                ? "Your free trial has expired. Purchase this course to continue studying."
                : "You need to have an active trial or purchase this course to access the questions."}
            </p>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/courses/${courseId}`}>View course</Link>
            </Button>
            <Button onClick={() => purchaseMutation.mutate(courseId)}>
              <IconShoppingCart className="mr-2 h-4 w-4" />
              Buy course
            </Button>
          </div>
        </div>
      </>
    );
  }

  // No questions
  if (questions.length === 0) {
    return (
      <>
        <PageHeader
          title={block ? `Block ${block.code}` : "Block"}
          description={block?.title}
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
          <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
            <IconBook className="text-muted-foreground h-10 w-10" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">No questions available</h2>
            <p className="text-muted-foreground mt-2">
              This block doesn&apos;t have any questions yet.
            </p>
          </div>
          <Button asChild className="mt-4">
            <Link href={`/dashboard/courses/${courseId}`}>Back to course</Link>
          </Button>
        </div>
      </>
    );
  }

  const globalQuestionNumber = currentQuestionIndex + 1;

  return (
    <>
      <PageHeader
        title={block ? `Block ${block.code}` : "Block"}
        description={block?.title}
      >
        <div className="flex items-center gap-4">
          {stats && (
            <div className="text-muted-foreground text-sm">
              {stats.answered} answered • {stats.correct} correct (
              {stats.accuracy}%)
            </div>
          )}
          <Button variant="outline" asChild>
            <Link href={`/dashboard/courses/${courseId}`}>
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Back to course
            </Link>
          </Button>
        </div>
      </PageHeader>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Questions sidebar */}
        <div className="bg-muted/30 w-full border-b p-4 md:w-64 md:border-r md:border-b-0">
          {/* Trial banner */}
          {isTrial && access?.trialDaysRemaining !== null && (
            <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
              <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                <IconClock className="h-4 w-4" />
                <span>{access.trialDaysRemaining} days left in trial</span>
              </div>
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                {(access as { isBlockA?: boolean }).isBlockA
                  ? `${accessibleQuestions} of ${totalQuestions} questions available`
                  : "Block A only in trial mode"}
              </p>
            </div>
          )}

          {/* Question grid */}
          <ScrollArea className="h-[200px] md:h-[calc(100vh-300px)]">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(36px,1fr))] gap-2">
              {questions.map((q, index) => {
                let status: "correct" | "incorrect" | "unanswered" =
                  "unanswered";
                const localAnswer = localAnswers.get(q.id);
                if (localAnswer) {
                  status = localAnswer.isCorrect ? "correct" : "incorrect";
                } else if (q.userAttempt) {
                  status = q.userAttempt.isCorrect ? "correct" : "incorrect";
                }

                const questionIsLocked =
                  (q as { isLocked?: boolean }).isLocked ?? false;

                return (
                  <QuestionTile
                    key={q.id}
                    number={index + 1}
                    status={status}
                    isSelected={index === currentQuestionIndex}
                    isLocked={questionIsLocked}
                    onClick={() =>
                      !questionIsLocked && handleQuestionChange(index)
                    }
                  />
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-3xl">
            {currentQuestion && (
              <>
                {(currentQuestion as { isLocked?: boolean }).isLocked ? (
                  // Locked question content
                  <div className="flex flex-col items-center justify-center gap-4 py-16">
                    <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
                      <IconLock className="text-muted-foreground h-10 w-10" />
                    </div>
                    <div className="max-w-md text-center">
                      <h2 className="text-xl font-semibold">Question Locked</h2>
                      <p className="text-muted-foreground mt-2">
                        {isTrial
                          ? "This question is only available for course owners. Purchase the course to unlock all questions."
                          : "Purchase this course to access this question."}
                      </p>
                    </div>
                    <Button
                      onClick={() => purchaseMutation.mutate(courseId)}
                      className="mt-4"
                    >
                      <IconShoppingCart className="mr-2 h-4 w-4" />
                      Purchase Course
                    </Button>
                  </div>
                ) : (
                  // Regular question content
                  <>
                    <QuestionCard
                      question={currentQuestion}
                      questionNumber={globalQuestionNumber}
                      selectedOption={selectedOption}
                      onSelectOption={setSelectedOption}
                      onConfirmAnswer={handleConfirmAnswer}
                      isSubmitting={submitMutation.isPending}
                      localAnswer={localAnswers.get(currentQuestion.id) ?? null}
                    />

                    {/* Navigation buttons */}
                    <div className="mt-6 flex items-center justify-between border-t pt-4">
                      <Button
                        variant="outline"
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                      >
                        <IconArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>

                      <span className="text-muted-foreground text-sm">
                        {globalQuestionNumber} of {totalQuestions}
                      </span>

                      <Button
                        onClick={handleNextQuestion}
                        disabled={
                          !isCurrentAnswered ||
                          currentQuestionIndex === questions.length - 1
                        }
                      >
                        Next
                        <IconArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
