"use client";

import Link from "next/link";
import { IconBooks } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";

import { useMyCourses } from "../hooks";
import { MyCourseCard, MyCourseCardSkeleton } from "../components";

export function MyCoursesView() {
  const { data: courses, isLoading } = useMyCourses();

  // Empty state
  if (!isLoading && (!courses || courses.length === 0)) {
    return (
      <>
        <PageHeader
          title="My Courses"
          description="Courses you've already purchased"
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
          <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
            <IconBooks className="text-muted-foreground h-10 w-10" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">No courses yet</h2>
            <p className="text-muted-foreground mt-2">
              You haven&apos;t purchased any courses yet. Browse our catalog to
              get started!
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
        title="My Courses"
        description="Courses you've already purchased"
      />

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(2)].map((_, i) => (
                <MyCourseCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses?.map((course) => (
                <MyCourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
