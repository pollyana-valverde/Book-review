import { Suspense } from "react";
import { prisma } from "@/lib/prisma";

import { Text } from "@/components/ui/text";
import { ReviewList } from "@/template/books-review-page/components/review-list";
import { SearchSection } from "@/template/books-review-page/components/review-search";
import { ReviewSkeleton } from "@/template/books-review-page/components/review-skeleton";

import { ReviewDTO } from "@/template/books-review-page/types";

async function BooksReviewPage({
  title,
  category,
}: {
  title?: ReviewDTO["title"];
  category?: Album["id"];
}) {
  const normalizedTitle = title?.trim() ?? "";
  const normalizedCategory =
    category && category !== "all" ? category : undefined;

  const albums = await prisma.album.findMany();
  const review = await prisma.review.findMany({
    where: {
      title: {
        contains: normalizedTitle,
        mode: "insensitive",
      },
      categoryId: normalizedCategory,
    },
    include: {
      category: {
        select: {
          title: true,
        },
      },
    },
  });

  const bookReviews: ReviewDTO[] = review.map((r) => ({
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
    <Suspense fallback={<ReviewSkeleton />}>
      <div className="flex flex-col gap-4">
        <div>
          <Text as="h1" variant="heading-1">
            Resenhas
          </Text>
          <Text as="p" className="text-muted-foreground">
            Todas as suas resenhas de livros
          </Text>
        </div>
        <SearchSection albums={albums} />
        <ReviewList reviewsList={bookReviews} />
      </div>
    </Suspense>
  );
}

export { BooksReviewPage };
