import { ReviewCard } from "@/template/books-review-page/components";

import { booksReviewList } from "@/utils/book-review-list";

function RecentReviewList() {
  return (
    <div
      className={`grid 
    sm:grid-cols-2 gap-3
    `}
    >
      {booksReviewList.map((book, index) => (
        <ReviewCard key={`${book}-${index}`} book={book} />
      ))}
    </div>
  );
}

export { RecentReviewList };
