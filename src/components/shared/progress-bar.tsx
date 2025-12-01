export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}
