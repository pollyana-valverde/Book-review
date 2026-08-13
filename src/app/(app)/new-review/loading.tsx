function NewReviewLoading() {
  return (
    <div className="animate-pulse flex flex-col gap-7">
      <div className="flex gap-4 items-center">
        <div className="h-13 w-13 bg-muted rounded-xl" />
        <div className="space-y-2">
          <div className="h-7.5 w-40 bg-muted rounded-xl" />
          <div className="h-5 w-56 bg-muted rounded-xl" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-10 bg-muted rounded-xl" />
        <div className="h-10 bg-muted rounded-xl" />
      </div>

      <div className="h-8 w-full bg-muted rounded-xl" />
      <div className="h-8 w-40 bg-muted rounded-xl" />
      <div className="h-55 w-full bg-muted rounded-xl" />
    </div>
  );
}

export default NewReviewLoading;
