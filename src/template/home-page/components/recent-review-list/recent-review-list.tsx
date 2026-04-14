import { prisma } from "@/lib/prisma";

import { ReviewCard } from "@/template/books-review-page/components/review-card";

async function RecentReviewList() {
  const reviews = await prisma.review.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: 4,
    include: {
      category: {
        select: {
          title: true,
        },
      },
    },
  });

  return (
    <div
      className={`grid 
    sm:grid-cols-2 gap-3
    `}
    >
      {reviews.map((book) => (
        <ReviewCard key={book.id} review={book} />
      ))}
    </div>
  );
}

export { RecentReviewList };
