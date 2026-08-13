import "server-only";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { revalidateTag } from "next/cache";
import * as reviewService from "@/server/modules/reviews/review.service";
import {
  reviewIdParamSchema,
  reviewResponseSchema,
  reviewsListResponseSchema,
  createReviewBodySchema,
  updateReviewBodySchema,
  listReviewsQueryOpenApiSchema,
} from "@/server/modules/reviews/review.openapi";
import { errorSchema } from "@/server/api/lib/error-schema";
import { tagsForReviewMutation, REVALIDATE_NOW } from "@/server/lib/cache-tags";
import { zodValidationHook } from "@/server/api/lib/validation-hook";
import {
  sessionMiddleware,
  requireAuth,
} from "@/server/api/middlewares/session";
import type { AppEnv } from "@/server/api/factory";

// Todas as rotas de review exigem sessão — nenhuma leitura ou escrita de
// domínio é pública nesta fase. `middleware` no createRoute em vez de
// `.use()` encadeado: `.use()` no meio da cadeia degrada o tipo de volta
// para `Hono` puro e o `.openapi()` seguinte deixa de existir no tipo.
const authMiddleware = [sessionMiddleware, requireAuth];

const listRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Reviews"],
  summary: "Lista resenhas",
  middleware: authMiddleware,
  security: [{ cookieAuth: [] }],
  request: { query: listReviewsQueryOpenApiSchema },
  responses: {
    200: {
      content: { "application/json": { schema: reviewsListResponseSchema } },
      description: "Página de resenhas",
    },
    400: {
      content: { "application/json": { schema: errorSchema } },
      description: "Query inválida",
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

const getByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Reviews"],
  summary: "Busca uma resenha por id",
  middleware: authMiddleware,
  security: [{ cookieAuth: [] }],
  request: { params: reviewIdParamSchema },
  responses: {
    200: {
      content: { "application/json": { schema: reviewResponseSchema } },
      description: "Resenha encontrada",
    },
    404: {
      content: { "application/json": { schema: errorSchema } },
      description: "Resenha não encontrada",
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

const createReviewRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Reviews"],
  summary: "Cria uma resenha",
  middleware: authMiddleware,
  security: [{ cookieAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: createReviewBodySchema } } },
  },
  responses: {
    201: {
      content: { "application/json": { schema: reviewResponseSchema } },
      description: "Resenha criada",
    },
    400: {
      content: { "application/json": { schema: errorSchema } },
      description: "Payload inválido",
    },
    409: {
      content: { "application/json": { schema: errorSchema } },
      description: "Já existe uma resenha para este livro",
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

const updateReviewRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Reviews"],
  summary: "Atualiza uma resenha",
  middleware: authMiddleware,
  security: [{ cookieAuth: [] }],
  request: {
    params: reviewIdParamSchema,
    body: { content: { "application/json": { schema: updateReviewBodySchema } } },
  },
  responses: {
    200: {
      content: { "application/json": { schema: reviewResponseSchema } },
      description: "Resenha atualizada",
    },
    400: {
      content: { "application/json": { schema: errorSchema } },
      description: "Payload inválido",
    },
    404: {
      content: { "application/json": { schema: errorSchema } },
      description: "Resenha não encontrada",
    },
    409: {
      content: { "application/json": { schema: errorSchema } },
      description: "Já existe uma resenha para este livro",
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

const removeReviewRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Reviews"],
  summary: "Remove uma resenha",
  middleware: authMiddleware,
  security: [{ cookieAuth: [] }],
  request: { params: reviewIdParamSchema },
  responses: {
    204: { description: "Resenha removida" },
    404: {
      content: { "application/json": { schema: errorSchema } },
      description: "Resenha não encontrada",
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

const reviewRoutes = new OpenAPIHono<AppEnv>({ defaultHook: zodValidationHook })
  .openapi(listRoute, async (c) => {
    const user = c.get("user")!;
    const query = c.req.valid("query");
    const result = await reviewService.list(user.id, query);
    return c.json(result);
  })
  .openapi(getByIdRoute, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.valid("param");
    const review = await reviewService.getById(user.id, id);
    return c.json(review);
  })
  .openapi(createReviewRoute, async (c) => {
    const user = c.get("user")!;
    const data = c.req.valid("json");
    const review = await reviewService.create(user.id, data);

    for (const tag of tagsForReviewMutation(user.id)) {
      revalidateTag(tag, REVALIDATE_NOW);
    }

    return c.json(review, 201);
  })
  .openapi(updateReviewRoute, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const review = await reviewService.update(user.id, id, data);

    for (const tag of tagsForReviewMutation(user.id, id)) {
      revalidateTag(tag, REVALIDATE_NOW);
    }

    return c.json(review);
  })
  .openapi(removeReviewRoute, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.valid("param");
    await reviewService.remove(user.id, id);

    for (const tag of tagsForReviewMutation(user.id, id)) {
      revalidateTag(tag, REVALIDATE_NOW);
    }

    return c.body(null, 204);
  });

export { reviewRoutes };
