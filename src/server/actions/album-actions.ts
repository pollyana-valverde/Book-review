"use server";

import { revalidatePath } from "next/cache";
import * as albumService from "@/server/modules/albums/album.service";
import {
  createAlbumSchema,
  type CreateAlbumInput,
} from "@/server/modules/albums/album.contract";
import { toActionResult, type ActionResult } from "@/server/lib/action-result";
import { REVALIDATE_PATHS } from "@/server/actions/revalidate-paths";

async function createAlbum(data: CreateAlbumInput): Promise<ActionResult> {
  try {
    const parsedData = createAlbumSchema.parse(data);
    await albumService.create(parsedData);

    for (const path of REVALIDATE_PATHS) {
      revalidatePath(path);
    }

    return { success: true };
  } catch (error) {
    return toActionResult(error);
  }
}

async function deleteAlbum(id: string): Promise<ActionResult> {
  try {
    await albumService.remove(id);

    for (const path of REVALIDATE_PATHS) {
      revalidatePath(path);
    }

    return { success: true };
  } catch (error) {
    return toActionResult(error);
  }
}

export { createAlbum, deleteAlbum };
