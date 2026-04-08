import { ReviewCard } from "@/template/books-review-page/components";

import { booksReviewList } from "@/utils/book-review-list";

function ReviewList() {
  return (
    <div
      className={`grid 
      sm:grid-cols-2 
      lg:grid-cols-3 
      xl:grid-cols-4 gap-3
     `}
    >
      {booksReviewList.map((book, index) => (
        <ReviewCard key={`${book}-${index}`} book={book} />
      ))}
    </div>
  );
}

export { ReviewList };
