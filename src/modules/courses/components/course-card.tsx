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
    <Card className="flex flex-col gap-3 overflow-hidden pt-0">
      <div className="from-primary/20 to-primary/5 relative aspect-video bg-linear-to-br">
        <div className="absolute inset-0 flex items-center justify-center">
          <IconBooks className="text-primary/40 h-16 w-16" />
        </div>
        {course.hasAccess && (
          <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
            Owned
          </Badge>
        )}
      </div>
      <CardHeader className="pb-0">
        <h3 className="line-clamp-2 leading-tight font-semibold">
          {course.name}
        </h3>
      </CardHeader>
      <CardContent className="space-y-2 py-0">
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {course.description || "No description available."}
        </p>
        <div className="text-muted-foreground flex items-center gap-4 text-xs">
          <span>{course.blockCount} blocks</span>
          <span>{course.questionCount} questions</span>
        </div>
        {!course.hasAccess && (
          <p className="text-primary text-sm font-semibold">
            {formatPrice(course.price, course.currency)}
          </p>
        )}
      </CardContent>
      <CardFooter className="mt-auto pt-0">
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
