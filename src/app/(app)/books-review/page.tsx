import { Suspense } from "react";
import {
  BooksReviewHeader,
  ReviewListSection,
} from "@/template/books-review-page";
import { ReviewSkeleton } from "@/template/books-review-page/components/review-skeleton";
import { BooksReviewSearchParams } from "@/template/books-review-page/types";

export default async function BooksReview({
  searchParams,
}: {
  searchParams: Promise<BooksReviewSearchParams>;
}) {
  const rawParams = await searchParams;

  const title = Array.isArray(rawParams.title)
    ? rawParams.title[0]
    : rawParams.title;
  const category = Array.isArray(rawParams.category)
    ? rawParams.category[0]
    : rawParams.category;

  return (
    <div className="flex flex-col gap-4">
      <BooksReviewHeader />
      <Suspense
        key={`${title ?? ""}-${category ?? ""}`}
        fallback={<ReviewSkeleton />}
      >
        <ReviewListSection title={title} category={category} />
      </Suspense>
    </div>
  );
}
