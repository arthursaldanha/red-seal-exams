"use client";

import { IconChecklist } from "@tabler/icons-react";

import { PageHeader } from "@/components/dashboard/page-header";

export function StudiesView() {
  return (
    <>
      <PageHeader
        title="Study Planner"
        description="Organize and track your study sessions"
      />

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col items-center justify-center gap-4 p-4 md:p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <IconChecklist className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold">Study Planner Coming Soon</h2>
            <p className="mt-2 text-muted-foreground">
              We&apos;re building a study planner to help you organize your
              learning journey. Check back soon!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
