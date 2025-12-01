"use client";

import { useState } from "react";
import { IconSearch, IconBooks } from "@tabler/icons-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { TrialBanner } from "@/components/shared";

import { useCourses, usePlatformAccess } from "../hooks";
import { CourseCard, CourseCardSkeleton } from "../components";

export function CoursesView() {
  const { data, isLoading } = useCourses();
  const { data: platformAccess } = usePlatformAccess();
  const [searchQuery, setSearchQuery] = useState("");

  const courses = data?.courses ?? [];
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Courses"
        description="Choose a trade to start or expand your studies"
      >
        <div className="relative w-full max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </PageHeader>

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          {/* Trial Banner */}
          {platformAccess?.isTrialActive &&
            platformAccess.trialDaysRemaining !== null && (
              <TrialBanner daysRemaining={platformAccess.trialDaysRemaining} />
            )}

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <IconBooks className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">No courses found</h2>
                <p className="mt-2 text-muted-foreground">
                  {searchQuery
                    ? `No courses match "${searchQuery}". Try a different search.`
                    : "There are no courses available at the moment."}
                </p>
              </div>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
