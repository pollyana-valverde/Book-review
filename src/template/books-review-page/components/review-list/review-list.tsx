"use client";
import { ReviewCard } from "@/template/books-review-page/components";

import { booksReviewList } from "@/utils/book-review-list";
import { useSearchParams } from "next/navigation";

function ReviewList() {
  const searchParams = useSearchParams();
  const searchQueryTitle = searchParams.get("title") || "";
  const searchQueryCategory =
    (searchParams?.get("category") as Album["badge"]) || "";

  const reviewsList = booksReviewList.filter((book) => {
    const matchesTitle =
      !searchQueryTitle ||
      book.title.toLowerCase().includes(searchQueryTitle.toLowerCase());

    const matchesCategory =
      !searchQueryCategory ||
      book.badge?.some((b) => b.variant === searchQueryCategory);

    return matchesTitle && matchesCategory;
  });

  const hasReviews = reviewsList.length > 0;

  if (!hasReviews) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold">No reviews found</h2>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filter to find what you are looking for.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid 
      sm:grid-cols-2 
      lg:grid-cols-3 
      xl:grid-cols-4 gap-3
     `}
    >
      {reviewsList.map((book, index) => (
        <ReviewCard key={`${book}-${index}`} book={book} />
      ))}
    </div>
  );
}

export { ReviewList };
