import "server-only";
import { Hono } from "hono";
import { revalidateTag } from "next/cache";
import { zValidator } from "@hono/zod-validator";
import * as albumService from "@/server/modules/albums/album.service";
import { createAlbumSchema } from "@/server/modules/albums/album.contract";
import { albumsTag, REVALIDATE_NOW } from "@/server/lib/cache-tags";
import { zodValidationHook } from "@/server/api/lib/validation-hook";
import type { AppEnv } from "@/server/api/factory";

const albumRoutes = new Hono<AppEnv>()
  .get("/", async (c) => {
    const albums = await albumService.list();
    return c.json(albums);
  })
  .post(
    "/",
    zValidator("json", createAlbumSchema, zodValidationHook),
    async (c) => {
      const data = c.req.valid("json");
      const album = await albumService.create(data);

      revalidateTag(albumsTag(), REVALIDATE_NOW);

      return c.json(album, 201);
    }
  )
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await albumService.remove(id);

    revalidateTag(albumsTag(), REVALIDATE_NOW);

    return c.body(null, 204);
  });

export { albumRoutes };
