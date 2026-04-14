"use client";

import { useSearchParams } from "next/navigation";
import { ReviewDTO } from "@/template/books-review-page/types";

import { ReviewCard } from "@/template/books-review-page/components/review-card";

function ReviewList({ review }: { review: ReviewDTO[] }) {
  const searchParams = useSearchParams();
  const searchQueryTitle = searchParams.get("title") || "";
  const searchQueryCategory =
    (searchParams?.get("category") as Album["id"]) || "";

  const reviewsList = review.filter((book) => {
    const matchesTitle =
      !searchQueryTitle ||
      book.title.toLowerCase().includes(searchQueryTitle.toLowerCase());

    const matchesCategory =
      !searchQueryCategory ||
      book.categoryId?.toLowerCase() === searchQueryCategory.toLowerCase();

    return matchesTitle && matchesCategory;
  });

  const hasReviews = reviewsList.length > 0;

  if (!hasReviews) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold">Nenhuma resenha encontrada</h2>
        <p className="text-muted-foreground mt-2">
          Tente ajustar sua pesquisa ou filtro para encontrar o que você está
          procurando.
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
      {reviewsList.map((book) => (
        <ReviewCard key={book.id} review={book} />
      ))}
    </div>
  );
}

export { ReviewList };
