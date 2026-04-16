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

  const hasReviews = bookReviews.length > 0;

  if (!hasReviews) {
    return (
      <div className="text-center py-10">
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
