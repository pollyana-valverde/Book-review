import "server-only";
import type { Collection, Review } from "@/generated/prisma/client";
import type { ReviewDTO } from "@/server/modules/reviews/review.contract";

type ReviewWithCollection = Review & { collection: Pick<Collection, "title"> };

function toReviewDTO(review: ReviewWithCollection): ReviewDTO {
  return {
    id: review.id,
    title: review.title,
    author: review.author,
    description: review.description,
    rating: review.rating,
    collectionId: review.collectionId,
    collectionTitle: review.collection.title,
    updatedAt: review.updatedAt.toISOString(),
  };
}

export { toReviewDTO };
