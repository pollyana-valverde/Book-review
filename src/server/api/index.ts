import "server-only";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { prisma } from "@/server/db/prisma";
import { auth } from "@/server/auth/auth";
import { errorHandler } from "@/server/api/middlewares/error-handler";
import { sessionMiddleware, requireAuth } from "@/server/api/middlewares/session";
import { reviewRoutes } from "@/server/modules/reviews/review.routes";
import { collectionRoutes } from "@/server/modules/collections/collection.routes";
import { env } from "@/lib/env";
import type { AppEnv } from "@/server/api/factory";

const app = new OpenAPIHono<AppEnv>().basePath("/api").onError(errorHandler);

// Security scheme documentado no OpenAPI (fase 6): as rotas de review e
// collection agora exigem sessão. O handler do BetterAuth (montado abaixo,
// fora da cadeia .route()) fica de fora do documento de propósito — ver
// comentário mais adiante.
app.openAPIRegistry.registerComponent("securitySchemes", "cookieAuth", {
  type: "apiKey",
  in: "cookie",
  name: "better-auth.session_token",
  description:
    "Cookie de sessão HttpOnly do BetterAuth. Obtido via POST /api/auth/sign-in/email (ou login social) — não pode ser lido/setado por JavaScript no cliente.",
});

// A doc e a UI de referência só existem fora de produção: uma API que vai
// ficar autenticada na fase 5 não deve expor o próprio mapa publicamente.
const docsEnabled = env.NODE_ENV !== "production";

// Handler do BetterAuth: NÃO passa pelo OpenAPIHono (é `.on()` com o
// Request cru, não `createRoute`/`.openapi()`) e por isso não entra no
// documento OpenAPI. Fora da expressão encadeada de propósito — não é
// `.route()`, não precisa compor o AppType, e não queremos essas rotas no
// cliente RPC (o BetterAuth tem o próprio client, ver
// src/features/auth/lib/auth-client.ts).
app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

// Armadilha do RPC do Hono: os `.route()` PRECISAM ficar encadeados nesta
// única expressão, atribuída a uma variável (`routes`), e é dela que o
// AppType é inferido — se algum `.route()` virar um statement separado, o
// AppType perde essas rotas e o cliente RPC vira `any` sem erro de build.
// OpenAPIHono estende Hono, então essa regra segue valendo igual à fase 4.
const routes = app
  .get("/health", async (c) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return c.json({ status: "ok", database: "up" });
    } catch (error) {
      console.error(error);
      return c.json({ status: "error", database: "down" }, 503);
    }
  })
  // Rota de exemplo provando sessionMiddleware/requireAuth. Não é
  // `createRoute` de propósito — é só um smoke test para a fase 6 construir
  // em cima, não um endpoint documentado.
  .get("/me", sessionMiddleware, requireAuth, (c) => {
    const user = c.get("user")!;
    return c.json({ user });
  })
  .route("/reviews", reviewRoutes)
  .route("/collections", collectionRoutes);

type AppType = typeof routes;

if (docsEnabled) {
  app.doc31("/doc", {
    openapi: "3.1.0",
    info: {
      title: "Book Review API",
      version: "0.1.0",
      description:
        "API HTTP (Hono) sobre os services de reviews e collections do Book Review. Sem autenticação ainda (fase 5).",
    },
  });

  app.get("/reference", Scalar({ url: "/api/doc" }));
} else {
  app.get("/doc", (c) => c.notFound());
  app.get("/reference", (c) => c.notFound());
}

export { routes as app };
export type { AppType };
