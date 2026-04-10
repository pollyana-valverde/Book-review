import { ReviewCard } from "@/template/books-review-page/components";

import { booksReviewList } from "@/utils/book-review-list";

function RecentReviewList() {
  // TODO: Adicionar campo 'updatedAt' no tipo BookReview para filtrar por data mais recente
  const REVIEWS_LIMIT = 4;
  
  const recentReviews = booksReviewList
    // .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) // Descomentar quando tiver updatedAt
    .slice(0, REVIEWS_LIMIT);

  return (
    <div
      className={`grid 
    sm:grid-cols-2 gap-3
    `}
    >
      {recentReviews.map((book, index) => (
        <ReviewCard key={`${book}-${index}`} book={book} />
      ))}
    </div>
  );
}

export { RecentReviewList };
