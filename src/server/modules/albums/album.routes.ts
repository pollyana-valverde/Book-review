import "server-only";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { revalidateTag } from "next/cache";
import * as albumService from "@/server/modules/albums/album.service";
import {
  albumIdParamSchema,
  albumResponseSchema,
  albumsListResponseSchema,
  createAlbumBodySchema,
} from "@/server/modules/albums/album.openapi";
import { errorSchema } from "@/server/api/lib/error-schema";
import { albumsTag, REVALIDATE_NOW } from "@/server/lib/cache-tags";
import { zodValidationHook } from "@/server/api/lib/validation-hook";
import type { AppEnv } from "@/server/api/factory";

const listRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Albums"],
  summary: "Lista álbuns",
  responses: {
    200: {
      content: { "application/json": { schema: albumsListResponseSchema } },
      description: "Lista de álbuns",
    },
    500: {
      content: { "application/json": { schema: errorSchema } },
      description: "Erro interno",
    },
  },
});

const createAlbumRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Albums"],
  summary: "Cria um álbum",
  request: {
    body: { content: { "application/json": { schema: createAlbumBodySchema } } },
  },
  responses: {
    201: {
      content: { "application/json": { schema: albumResponseSchema } },
      description: "Álbum criado",
    },
    400: {
      content: { "application/json": { schema: errorSchema } },
      description: "Payload inválido",
    },
    409: {
      content: { "application/json": { schema: errorSchema } },
      description: "Já existe um álbum com este título",
    },
    500: {
      content: { "application/json": { schema: errorSchema } },
      description: "Erro interno",
    },
  },
});

const removeAlbumRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Albums"],
  summary: "Remove um álbum",
  request: { params: albumIdParamSchema },
  responses: {
    204: { description: "Álbum removido" },
    404: {
      content: { "application/json": { schema: errorSchema } },
      description: "Álbum não encontrado",
    },
    500: {
      content: { "application/json": { schema: errorSchema } },
      description: "Erro interno",
    },
  },
});

const albumRoutes = new OpenAPIHono<AppEnv>({ defaultHook: zodValidationHook })
  .openapi(listRoute, async (c) => {
    const albums = await albumService.list();
    return c.json(albums);
  })
  .openapi(createAlbumRoute, async (c) => {
    const data = c.req.valid("json");
    const album = await albumService.create(data);

    revalidateTag(albumsTag(), REVALIDATE_NOW);

    return c.json(album, 201);
  })
  .openapi(removeAlbumRoute, async (c) => {
    const { id } = c.req.valid("param");
    await albumService.remove(id);

    revalidateTag(albumsTag(), REVALIDATE_NOW);

    return c.body(null, 204);
  });

export { albumRoutes };
