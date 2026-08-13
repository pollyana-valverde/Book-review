"use server";

import { revalidateTag } from "next/cache";
import * as albumService from "@/server/modules/albums/album.service";
import { toActionResult, type ActionResult } from "@/server/lib/action-result";
import { albumsTag, REVALIDATE_NOW } from "@/server/lib/cache-tags";
import { requireSession } from "@/server/auth/session";

// `createAlbum` foi removida: album-form.tsx migrou para o RPC do Hono
// nesta fase (fatia vertical da tarefa 9). `deleteAlbum` continua como
// Server Action porque só o formulário de criação foi migrado.
async function deleteAlbum(id: string): Promise<ActionResult> {
  // Fora do try/catch de propósito: requireSession() usa redirect() do
  // Next por baixo, que lança um erro especial (NEXT_REDIRECT) que
  // precisa atravessar sem ser capturado. Um catch genérico ao redor
  // transformaria o redirect num resultado de erro comum.
  const { user } = await requireSession();

  try {
    await albumService.remove(user.id, id);

    revalidateTag(albumsTag(user.id), REVALIDATE_NOW);

    return { success: true };
  } catch (error) {
    return toActionResult(error);
  }
}

export { deleteAlbum };
