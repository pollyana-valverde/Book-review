import "server-only";
import type { Album, Review } from "@/generated/prisma/client";
import type { ReviewDTO } from "@/server/modules/reviews/review.contract";

type ReviewWithCategory = Review & { category: Pick<Album, "title"> };

function toReviewDTO(review: ReviewWithCategory): ReviewDTO {
  return {
    id: review.id,
    title: review.title,
    author: review.author,
    description: review.description,
    rating: review.rating,
    categoryId: review.categoryId,
    categoryTitle: review.category.title,
    updatedAt: review.updatedAt.toISOString(),
  };
}

export { toReviewDTO };
