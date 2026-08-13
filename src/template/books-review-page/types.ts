import type { ReviewDTO } from "@/server/modules/reviews/review.contract";

type BooksReviewSearchParams = {
  title?: string | string[];
  collection?: string | string[];
};

export type { BooksReviewSearchParams, ReviewDTO };
