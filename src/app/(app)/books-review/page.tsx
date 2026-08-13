import { Suspense } from "react";
import {
  BooksReviewHeader,
  ReviewListSection,
} from "@/template/books-review-page";
import { HeaderSkeleton } from "@/template/books-review-page/components/header-skeleton";
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
  const collection = Array.isArray(rawParams.collection)
    ? rawParams.collection[0]
    : rawParams.collection;

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<HeaderSkeleton />}>
        <BooksReviewHeader />
      </Suspense>
      <Suspense
        key={`${title ?? ""}-${collection ?? ""}`}
        fallback={<ReviewSkeleton />}
      >
        <ReviewListSection title={title} collection={collection} />
      </Suspense>
    </div>
  );
}
