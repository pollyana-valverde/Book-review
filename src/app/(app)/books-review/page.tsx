import { Suspense } from "react";
import type { Metadata } from "next";
import {
  BooksReviewHeader,
  ReviewListSection,
  HeaderSkeleton,
  ReviewSkeleton,
  type BooksReviewSearchParams,
} from "@/features/reviews";

export const metadata: Metadata = {
  title: "Resenhas",
};

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
