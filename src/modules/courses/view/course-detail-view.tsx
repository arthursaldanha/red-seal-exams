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
import {
  ProgressBar,
  TrialBanner,
  BlockAccordionItem,
} from "@/components/shared";

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
          <div className="flex w-full max-w-4xl animate-pulse flex-col gap-4 p-6">
            <div className="bg-muted h-40 rounded-lg" />
            <div className="bg-muted h-8 w-1/2 rounded" />
            <div className="bg-muted h-4 w-full rounded" />
            <div className="bg-muted h-4 w-3/4 rounded" />
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
          <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
            <IconQuestionMark className="text-muted-foreground h-10 w-10" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">Course not found</h2>
            <p className="text-muted-foreground mt-2">
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
            <IconCheck className="mr-1 h-3 w-3" />
            Owned
          </Badge>
        ) : (
          <Button
            onClick={() => purchaseMutation.mutate(courseId)}
            disabled={purchaseMutation.isPending}
          >
            <IconShoppingCart className="mr-2 h-4 w-4" />
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
            <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <IconLock className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  Your free trial has expired
                </p>
                <p className="mt-1 text-xs text-red-700 dark:text-red-300">
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
            <div className="from-primary/30 via-primary/10 relative aspect-3/1 overflow-hidden rounded-t-lg bg-linear-to-br to-transparent">
              <div className="absolute inset-0 flex items-center justify-center">
                <IconBook className="text-primary/20 h-24 w-24" />
              </div>
              {!hasAccess && (
                <div className="bg-background/60 absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="text-center">
                    <IconLock className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                    <p className="text-muted-foreground text-sm">
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
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <IconBook className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{blocks.length}</p>
                    <p className="text-muted-foreground text-xs">Blocks</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <IconQuestionMark className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{totalQuestions}</p>
                    <p className="text-muted-foreground text-xs">Questions</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <IconProgress className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{progressPercent}%</p>
                    <p className="text-muted-foreground text-xs">Completed</p>
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
                  <p className="text-muted-foreground text-xs">
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
