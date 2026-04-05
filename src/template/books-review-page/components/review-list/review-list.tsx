import { ReviewCard } from "@/template/books-review-page/components";

const booksReview: BookReview[] = [
  {
    title: "Book Title 1",
    author: "Author 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    badge: [{ label: "Fantasia", variant: "fantasy" }],
    rating: 3,
  },
  {
    title: "Book Title 1",
    author: "Author 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    badge: [{ label: "Fantasia", variant: "fantasy" }],
    rating: 4,
  },
  {
    title: "Book Title 1",
    author: "Author 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    badge: [{ label: "Fantasia", variant: "fantasy" }],
    rating: 4,
  },
  {
    title: "Book Title 1",
    author: "Author 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    badge: [{ label: "Fantasia", variant: "fantasy" }],
    rating: 4,
  },
];

function ReviewList() {
  return (
    <div
      className={`grid 
      sm:grid-cols-2 
      lg:grid-cols-3 
      xl:grid-cols-4 gap-3
     `}
    >
      {booksReview.map((book, index) => (
        <ReviewCard key={`${book}-${index}`} book={book} />
      ))}
    </div>
  );
}

export { ReviewList };
