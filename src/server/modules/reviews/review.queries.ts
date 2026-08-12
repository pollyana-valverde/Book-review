import "server-only";
import { unstable_cache } from "next/cache";
import * as reviewService from "@/server/modules/reviews/review.service";
import { reviewsTag, reviewTag } from "@/server/lib/cache-tags";

const getReviews = unstable_cache(
  (query: Parameters<typeof reviewService.list>[0]) => reviewService.list(query),
  ["reviews-list"],
  { tags: [reviewsTag()] }
);

const getRecentReviews = unstable_cache(
  (limit: number) => reviewService.listRecent(limit),
  ["reviews-recent"],
  { tags: [reviewsTag()] }
);

const getAllReviews = unstable_cache(
  () => reviewService.getAll(),
  ["reviews-all"],
  { tags: [reviewsTag()] }
);

function getReviewById(id: string) {
  return unstable_cache(
    () => reviewService.getById(id),
    ["review-by-id", id],
    { tags: [reviewsTag(), reviewTag(id)] }
  )();
}

export { getReviews, getRecentReviews, getAllReviews, getReviewById };
