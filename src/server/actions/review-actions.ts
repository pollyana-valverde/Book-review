"use server";

import { revalidateTag } from "next/cache";
import * as reviewService from "@/server/modules/reviews/review.service";
import {
  createReviewSchema,
  type CreateReviewInput,
} from "@/server/modules/reviews/review.contract";
import { toActionResult, type ActionResult } from "@/server/lib/action-result";
import {
  reviewsTag,
  reviewTag,
  REVALIDATE_NOW,
} from "@/server/lib/cache-tags";

async function createReview(data: CreateReviewInput): Promise<ActionResult> {
  try {
    const parsedData = createReviewSchema.parse(data);
    await reviewService.create(parsedData);

    revalidateTag(reviewsTag(), REVALIDATE_NOW);

    return { success: true };
  } catch (error) {
    return toActionResult(error);
  }
}

async function deleteReview(id: string): Promise<ActionResult> {
  try {
    await reviewService.remove(id);

    revalidateTag(reviewsTag(), REVALIDATE_NOW);
    revalidateTag(reviewTag(id), REVALIDATE_NOW);

    return { success: true };
  } catch (error) {
    return toActionResult(error);
  }
}

export { createReview, deleteReview };
