import { getRecentReviews } from "@/server/modules/reviews/review.queries";

import { ReviewCard } from "@/template/books-review-page/components/review-card";

async function RecentReviewList() {
  const bookReviews = await getRecentReviews(4);

  const hasReviews = bookReviews.length > 0;

  if (!hasReviews) {
    return (
      <div className="py-10">
        <h2 className="text-2xl font-semibold">Nenhuma resenha encontrada</h2>
        <p className="text-muted-foreground mt-2">
          Crie resenhas para seus livros favoritos e elas aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid 
    sm:grid-cols-2 gap-3
    `}
    >
      {bookReviews.map((book) => (
        <ReviewCard key={book.id} review={book} />
      ))}
    </div>
  );
}

export { RecentReviewList };
