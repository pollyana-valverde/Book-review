import type { ReviewDTO } from "@/server/modules/reviews/review.contract";

type BooksReviewSearchParams = {
  title?: string | string[];
  category?: string | string[];
};

export type { BooksReviewSearchParams, ReviewDTO };
