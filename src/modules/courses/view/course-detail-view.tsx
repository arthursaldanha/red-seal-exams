"use client";

import Link from "next/link";
import {
  IconBook,
  IconLock,
  IconCheck,
  IconProgress,
  IconQuestionMark,
  IconShoppingCart,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProgressBar, TrialBanner, BlockAccordionItem } from "@/components/shared";

import { useCourseDetail, usePurchaseCourse } from "../hooks";
import { formatPrice } from "../helpers";

type CourseDetailViewProps = {
  courseId: string;
};

export function CourseDetailView({ courseId }: CourseDetailViewProps) {
  const { data, isLoading, error } = useCourseDetail(courseId);
  const purchaseMutation = usePurchaseCourse();

  const course = data?.course;
  const blocks = data?.blocks ?? [];
  const access = data?.access;
  const totalQuestions = data?.totalQuestions ?? 0;

  const hasAccess = access?.hasAccess ?? false;
  const accessType = access?.accessType ?? "none";
  const isOwner = accessType === "owner";
  const isTrial = accessType === "trial";

  // Calculate total progress
  const totalAttempted = blocks.reduce(
    (sum, b) => sum + (b.userProgress?.attempted ?? 0),
    0
  );
  const totalCorrect = blocks.reduce(
    (sum, b) => sum + (b.userProgress?.correct ?? 0),
    0
  );
  const progressPercent =
    totalQuestions > 0
      ? Math.round((totalAttempted / totalQuestions) * 100)
      : 0;

  if (isLoading) {
    return (
      <>
        <PageHeader title="Loading..." />
        <div className="flex flex-1 items-center justify-center">
          <div className="animate-pulse flex flex-col gap-4 w-full max-w-4xl p-6">
            <div className="h-40 bg-muted rounded-lg" />
            <div className="h-8 w-1/2 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
          </div>
        </div>
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <PageHeader title="Course not found" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <IconQuestionMark className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">Course not found</h2>
            <p className="mt-2 text-muted-foreground">
              The course you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
          </div>
          <Button asChild className="mt-4">
            <Link href="/dashboard/courses">Browse Courses</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={course.name}
        description="Course details and questions"
      >
        {isOwner ? (
          <Badge className="bg-green-500 hover:bg-green-600">
            <IconCheck className="h-3 w-3 mr-1" />
            Owned
          </Badge>
        ) : (
          <Button
            onClick={() => purchaseMutation.mutate(courseId)}
            disabled={purchaseMutation.isPending}
          >
            <IconShoppingCart className="h-4 w-4 mr-2" />
            {purchaseMutation.isPending
              ? "Processing..."
              : `Buy for ${formatPrice(course.price, course.currency)}`}
          </Button>
        )}
      </PageHeader>

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
          {/* Trial Banner */}
          {isTrial &&
            access?.trialDaysRemaining !== null &&
            access?.questionsLimit && (
              <TrialBanner
                daysRemaining={access.trialDaysRemaining}
                questionsLimit={access.questionsLimit}
                variant="detailed"
              />
            )}

          {/* Trial Expired Banner */}
          {access?.trialExpired && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
              <IconLock className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  Your free trial has expired
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  Purchase this course to continue studying.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => purchaseMutation.mutate(courseId)}
                disabled={purchaseMutation.isPending}
              >
                Buy now
              </Button>
            </div>
          )}

          {/* Course Header Card */}
          <Card className="pt-0">
            <div className="relative aspect-3/1 bg-linear-to-br from-primary/30 via-primary/10 to-transparent overflow-hidden rounded-t-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <IconBook className="h-24 w-24 text-primary/20" />
              </div>
              {!hasAccess && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="text-center">
                    <IconLock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {access?.trialExpired
                        ? "Trial expired - purchase to continue"
                        : "Unlock to access all content"}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{course.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {course.description || "No description available."}
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <IconBook className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{blocks.length}</p>
                    <p className="text-xs text-muted-foreground">Blocks</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <IconQuestionMark className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{totalQuestions}</p>
                    <p className="text-xs text-muted-foreground">Questions</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <IconProgress className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{progressPercent}%</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </div>

              {hasAccess && totalAttempted > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Your progress</span>
                    <span className="font-medium">
                      {totalAttempted}/{totalQuestions} questions answered
                    </span>
                  </div>
                  <ProgressBar value={progressPercent} />
                  <p className="text-xs text-muted-foreground">
                    {totalCorrect} correct answers (
                    {totalAttempted > 0
                      ? Math.round((totalCorrect / totalAttempted) * 100)
                      : 0}
                    % accuracy)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Blocks Accordion */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Course Content</h2>
            <Accordion type="multiple" className="w-full">
              {blocks.map((block) => (
                <BlockAccordionItem
                  key={block.id}
                  block={block}
                  courseSlug={course.slug}
                  hasAccess={hasAccess}
                  accessType={accessType}
                  questionsLimit={access?.questionsLimit ?? null}
                />
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}
