import "server-only";
// Side effect: ver comentário equivalente em review.openapi.ts.
import "@hono/zod-openapi";
import z from "zod";
import {
  createAlbumSchema,
  albumDTOSchema,
} from "@/server/modules/albums/album.contract";

const albumIdParamSchema = z.object({
  id: z.string().openapi({
    param: { name: "id", in: "path" },
    example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  }),
});

const albumResponseSchema = albumDTOSchema.openapi("Album", {
  description: "Um álbum usado para organizar resenhas",
});

const albumsListResponseSchema = z
  .array(albumDTOSchema)
  .openapi("AlbumsList", { description: "Lista de álbuns" });

const createAlbumBodySchema = createAlbumSchema.openapi("CreateAlbum");

export {
  albumIdParamSchema,
  albumResponseSchema,
  albumsListResponseSchema,
  createAlbumBodySchema,
};
