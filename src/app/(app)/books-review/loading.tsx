import { HeaderSkeleton } from "@/template/books-review-page/components/header-skeleton";
import { ReviewSkeleton } from "@/template/books-review-page/components/review-skeleton";

function BooksReviewLoading() {
  return (
    <div className="flex flex-col gap-4">
      <HeaderSkeleton />
      <ReviewSkeleton />
    </div>
  );
}

export default BooksReviewLoading;
