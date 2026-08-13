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
import { requireSession } from "@/server/auth/session";

async function createReview(data: CreateReviewInput): Promise<ActionResult> {
  // Fora do try/catch de propósito: ver o comentário equivalente em
  // collection-actions.ts sobre requireSession() e redirect().
  const { user } = await requireSession();

  try {
    const parsedData = createReviewSchema.parse(data);
    await reviewService.create(user.id, parsedData);

    revalidateTag(reviewsTag(user.id), REVALIDATE_NOW);

    return { success: true };
  } catch (error) {
    return toActionResult(error);
  }
}

async function deleteReview(id: string): Promise<ActionResult> {
  const { user } = await requireSession();

  try {
    await reviewService.remove(user.id, id);

    revalidateTag(reviewsTag(user.id), REVALIDATE_NOW);
    revalidateTag(reviewTag(user.id, id), REVALIDATE_NOW);

    return { success: true };
  } catch (error) {
    return toActionResult(error);
  }
}

export { createReview, deleteReview };
