function ReviewDetailLoading() {
  return (
    <div className="animate-pulse grid gap-4">
      <div className="h-5 w-20 bg-muted rounded-xl" />

      <div className="w-full rounded-xl border p-6 flex flex-col gap-4">
        <div className="space-y-2">
          <div className="h-7.5 w-1/2 bg-muted rounded-xl" />
          <div className="h-5 w-1/3 bg-muted rounded-xl" />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="h-6 w-20 bg-muted rounded-full" />
          <div className="h-6 w-24 bg-muted rounded-xl" />
          <div className="h-6 w-24 bg-muted rounded-xl" />
        </div>

        <div className="space-y-2">
          <div className="h-5 w-full bg-muted rounded-xl" />
          <div className="h-5 w-full bg-muted rounded-xl" />
          <div className="h-5 w-2/3 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default ReviewDetailLoading;
