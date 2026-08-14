"use server";

import { revalidateTag } from "next/cache";
import * as collectionService from "@/server/modules/collections/collection.service";
import { toActionResult, type ActionResult } from "@/server/lib/action-result";
import { collectionsTag, REVALIDATE_NOW } from "@/server/lib/cache-tags";
import { requireSession } from "@/server/auth/session";

// `createCollection` foi removida: collection-form.tsx migrou para o RPC do
// Hono nesta fase (fatia vertical da tarefa 9). `deleteCollection` continua
// como Server Action porque só o formulário de criação foi migrado.
async function deleteCollection(id: string): Promise<ActionResult> {
  // Fora do try/catch de propósito: requireSession() usa redirect() do
  // Next por baixo, que lança um erro especial (NEXT_REDIRECT) que
  // precisa atravessar sem ser capturado. Um catch genérico ao redor
  // transformaria o redirect num resultado de erro comum.
  const { user } = await requireSession();

  try {
    await collectionService.remove(user.id, id);

    revalidateTag(collectionsTag(user.id), REVALIDATE_NOW);

    return { success: true };
  } catch (error) {
    return toActionResult(error);
  }
}

export { deleteCollection };
