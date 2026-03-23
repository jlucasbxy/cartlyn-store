export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-100">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-primary/20 dark:border-primary/10" />
        <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      </div>
    </div>
  );
}
