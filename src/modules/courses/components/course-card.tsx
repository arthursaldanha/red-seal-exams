import Link from "next/link";
import { IconBooks, IconArrowRight } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { formatPrice } from "../helpers";

type CourseCardProps = {
  course: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    blockCount: number;
    questionCount: number;
    hasAccess: boolean;
    price: number;
    currency: string;
  };
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col gap-3 pt-0 overflow-hidden">
      <div className="relative aspect-video bg-linear-to-br from-primary/20 to-primary/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <IconBooks className="h-16 w-16 text-primary/40" />
        </div>
        {course.hasAccess && (
          <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
            Owned
          </Badge>
        )}
      </div>
      <CardHeader className="pb-0">
        <h3 className="font-semibold leading-tight line-clamp-2">
          {course.name}
        </h3>
      </CardHeader>
      <CardContent className="py-0 space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description || "No description available."}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{course.blockCount} blocks</span>
          <span>{course.questionCount} questions</span>
        </div>
        {!course.hasAccess && (
          <p className="text-sm font-semibold text-primary">
            {formatPrice(course.price, course.currency)}
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-0 mt-auto">
        <Button
          asChild
          className="w-full"
          variant={course.hasAccess ? "secondary" : "default"}
        >
          <Link href={`/dashboard/courses/${course.slug}`}>
            {course.hasAccess ? "View course" : "Learn more"}
            <IconArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
