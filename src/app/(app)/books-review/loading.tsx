import { HeaderSkeleton, ReviewSkeleton } from "@/features/reviews";

function BooksReviewLoading() {
  return (
    <div className="flex flex-col gap-4">
      <HeaderSkeleton />
      <ReviewSkeleton />
    </div>
  );
}

export default BooksReviewLoading;
