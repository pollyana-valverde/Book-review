function HeaderSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4">
      <div className="space-y-2">
        <div className="h-7.5 w-1/2 bg-muted rounded-xl" />
        <div className="h-5 w-2/3 bg-muted rounded-xl" />
      </div>
      <div className="flex gap-3">
        <div className="h-10 bg-muted rounded-xl flex-1" />
        <div className="h-10 w-20 bg-muted rounded-xl" />
      </div>
    </div>
  );
}

export { HeaderSkeleton };
