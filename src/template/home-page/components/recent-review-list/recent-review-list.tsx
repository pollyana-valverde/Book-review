import { prisma } from "@/lib/prisma";
import { ReviewCard } from "@/template/books-review-page/components";

async function RecentReviewList() {
  const reviews = await prisma.review.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: 4,
  });

  const REVIEWS_LIMIT = 4;

  const recentReviews = reviews
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
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
