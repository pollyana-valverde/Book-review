"use server";

import { revalidateTag } from "next/cache";
import * as reviewService from "@/server/modules/reviews/review.service";
import { toActionResult, type ActionResult } from "@/server/lib/action-result";
import { tagsForReviewMutation, REVALIDATE_NOW } from "@/server/lib/cache-tags";
import { requireSession } from "@/server/auth/session";

// `createReview` foi removida: new-review-form.tsx migrou para o RPC do
// Hono nesta fase (fase 8, junto com o editor Tiptap) — ver o comentário
// equivalente em collection-actions.ts sobre requireSession() e redirect()
// para o motivo de deleteReview continuar chamando requireSession() fora
// do try/catch.
async function deleteReview(id: string): Promise<ActionResult> {
  const { user } = await requireSession();

  try {
    await reviewService.remove(user.id, id);

    for (const tag of tagsForReviewMutation(user.id, id)) {
      revalidateTag(tag, REVALIDATE_NOW);
    }

    return { success: true };
  } catch (error) {
    return toActionResult(error);
  }
}

export { deleteReview };
