import "server-only";
import type { Collection, Review } from "@/generated/prisma/client";
import type { ReviewDTO } from "@/server/modules/reviews/review.contract";

type ReviewWithCollection = Review & { collection: Pick<Collection, "title"> };

function toReviewDTO(review: ReviewWithCollection): ReviewDTO {
  return {
    id: review.id,
    title: review.title,
    author: review.author,
    // review.content já passou por sanitizeRichText antes de ser
    // persistido (review.service.ts) — seguro devolver como está.
    content: review.content as ReviewDTO["content"],
    excerpt: review.excerpt,
    rating: review.rating,
    collectionId: review.collectionId,
    collectionTitle: review.collection.title,
    updatedAt: review.updatedAt.toISOString(),
  };
}

export { toReviewDTO };
