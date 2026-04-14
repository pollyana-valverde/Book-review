import { prisma } from "@/lib/prisma";
import { ReviewDTO } from "@/template/books-review-page/types";

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

  const bookReviews: ReviewDTO[] = reviews.map((r) => ({
    id: r.id,
    title: r.title,
    author: r.author,
    description: r.description,
    rating: r.rating,
    categoryId: r.categoryId,
    categoryTitle: r.category.title,
    updatedAt: r.updatedAt.toISOString(),
  }));

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
