"use server";

import { revalidateTag } from "next/cache";
import * as albumService from "@/server/modules/albums/album.service";
import { toActionResult, type ActionResult } from "@/server/lib/action-result";
import { albumsTag, REVALIDATE_NOW } from "@/server/lib/cache-tags";

// `createAlbum` foi removida: album-form.tsx migrou para o RPC do Hono
// nesta fase (fatia vertical da tarefa 9). `deleteAlbum` continua como
// Server Action porque só o formulário de criação foi migrado.
async function deleteAlbum(id: string): Promise<ActionResult> {
  try {
    await albumService.remove(id);

    revalidateTag(albumsTag(), REVALIDATE_NOW);

    return { success: true };
  } catch (error) {
    return toActionResult(error);
  }
}

export { deleteAlbum };
