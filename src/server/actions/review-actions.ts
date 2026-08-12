"use server";

import { revalidatePath } from "next/cache";
import * as reviewService from "@/server/modules/reviews/review.service";
import {
  createReviewSchema,
  type CreateReviewInput,
} from "@/server/modules/reviews/review.contract";
import { toActionResult, type ActionResult } from "@/server/lib/action-result";
import { REVALIDATE_PATHS } from "@/server/actions/revalidate-paths";

async function createReview(data: CreateReviewInput): Promise<ActionResult> {
  try {
    const parsedData = createReviewSchema.parse(data);
    await reviewService.create(parsedData);

    for (const path of REVALIDATE_PATHS) {
      revalidatePath(path);
    }

    return { success: true };
  } catch (error) {
    return toActionResult(error);
  }
}

async function deleteReview(id: string): Promise<ActionResult> {
  try {
    await reviewService.remove(id);

    for (const path of REVALIDATE_PATHS) {
      revalidatePath(path);
    }

    return { success: true };
  } catch (error) {
    return toActionResult(error);
  }
}

export { createReview, deleteReview };
