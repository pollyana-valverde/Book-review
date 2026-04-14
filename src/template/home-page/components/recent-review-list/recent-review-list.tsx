import { prisma } from "@/lib/prisma";

import { ReviewCard } from "@/template/books-review-page/components/review-card";

async function RecentReviewList() {
  const reviews = await prisma.review.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: 4,
  });

  return (
    <div
      className={`grid 
    sm:grid-cols-2 gap-3
    `}
    >
      {reviews.map((book, index) => (
        <ReviewCard key={`${book}-${index}`} book={book} />
      ))}
    </div>
  );
}

export { RecentReviewList };
