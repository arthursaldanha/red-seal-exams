import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function MyCourseCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="aspect-video bg-muted" />
      <CardHeader className="pb-2">
        <div className="h-5 w-3/4 bg-muted rounded" />
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-2/3 bg-muted rounded" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-9 w-full bg-muted rounded" />
      </CardFooter>
    </Card>
  );
}
