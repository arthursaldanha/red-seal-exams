import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function MyCourseCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="bg-muted aspect-video" />
      <CardHeader className="pb-2">
        <div className="bg-muted h-5 w-3/4 rounded" />
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <div className="space-y-2">
          <div className="bg-muted h-3 w-full rounded" />
          <div className="bg-muted h-3 w-2/3 rounded" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="bg-muted h-9 w-full rounded" />
      </CardFooter>
    </Card>
  );
}
