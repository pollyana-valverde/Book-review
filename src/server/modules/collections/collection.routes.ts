import "server-only";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { revalidateTag } from "next/cache";
import * as collectionService from "@/server/modules/collections/collection.service";
import {
  collectionIdParamSchema,
  collectionResponseSchema,
  collectionsListResponseSchema,
  createCollectionBodySchema,
} from "@/server/modules/collections/collection.openapi";
import { errorSchema } from "@/server/api/lib/error-schema";
import { collectionsTag, REVALIDATE_NOW } from "@/server/lib/cache-tags";
import { zodValidationHook } from "@/server/api/lib/validation-hook";
import {
  sessionMiddleware,
  requireAuth,
} from "@/server/api/middlewares/session";
import type { AppEnv } from "@/server/api/factory";

// Todas as rotas de coleção exigem sessão — nenhuma leitura ou escrita de
// domínio é pública nesta fase. `middleware` no createRoute em vez de
// `.use()` encadeado: `.use()` no meio da cadeia degrada o tipo de volta
// para `Hono` puro e o `.openapi()` seguinte deixa de existir no tipo.
const authMiddleware = [sessionMiddleware, requireAuth];

const listRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Collections"],
  summary: "Lista coleções",
  middleware: authMiddleware,
  security: [{ cookieAuth: [] }],
  responses: {
    200: {
      content: { "application/json": { schema: collectionsListResponseSchema } },
      description: "Lista de coleções",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Não autenticado",
    },
    500: {
      content: { "application/json": { schema: errorSchema } },
      description: "Erro interno",
    },
  },
});

const createCollectionRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Collections"],
  summary: "Cria uma coleção",
  middleware: authMiddleware,
  security: [{ cookieAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: createCollectionBodySchema } } },
  },
  responses: {
    201: {
      content: { "application/json": { schema: collectionResponseSchema } },
      description: "Coleção criada",
    },
    400: {
      content: { "application/json": { schema: errorSchema } },
      description: "Payload inválido",
    },
    409: {
      content: { "application/json": { schema: errorSchema } },
      description: "Já existe uma coleção com este título",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Não autenticado",
    },
    500: {
      content: { "application/json": { schema: errorSchema } },
      description: "Erro interno",
    },
  },
});

const removeCollectionRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Collections"],
  summary: "Remove uma coleção",
  middleware: authMiddleware,
  security: [{ cookieAuth: [] }],
  request: { params: collectionIdParamSchema },
  responses: {
    204: { description: "Coleção removida" },
    404: {
      content: { "application/json": { schema: errorSchema } },
      description: "Coleção não encontrada",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Não autenticado",
    },
    500: {
      content: { "application/json": { schema: errorSchema } },
      description: "Erro interno",
    },
  },
});

const collectionRoutes = new OpenAPIHono<AppEnv>({ defaultHook: zodValidationHook })
  .openapi(listRoute, async (c) => {
    const user = c.get("user")!;
    const collections = await collectionService.list(user.id);
    return c.json(collections);
  })
  .openapi(createCollectionRoute, async (c) => {
    const user = c.get("user")!;
    const data = c.req.valid("json");
    const collection = await collectionService.create(user.id, data);

    revalidateTag(collectionsTag(user.id), REVALIDATE_NOW);

    return c.json(collection, 201);
  })
  .openapi(removeCollectionRoute, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.valid("param");
    await collectionService.remove(user.id, id);

    revalidateTag(collectionsTag(user.id), REVALIDATE_NOW);

    return c.body(null, 204);
  });

export { collectionRoutes };
