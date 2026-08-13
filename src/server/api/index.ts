import "server-only";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { prisma } from "@/server/db/prisma";
import { errorHandler } from "@/server/api/middlewares/error-handler";
import { reviewRoutes } from "@/server/modules/reviews/review.routes";
import { albumRoutes } from "@/server/modules/albums/album.routes";
import { env } from "@/lib/env";
import type { AppEnv } from "@/server/api/factory";

const app = new OpenAPIHono<AppEnv>().basePath("/api").onError(errorHandler);

// A doc e a UI de referência só existem fora de produção: uma API que vai
// ficar autenticada na fase 5 não deve expor o próprio mapa publicamente.
const docsEnabled = env.NODE_ENV !== "production";

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
  .route("/reviews", reviewRoutes)
  .route("/albums", albumRoutes);

type AppType = typeof routes;

if (docsEnabled) {
  app.doc31("/doc", {
    openapi: "3.1.0",
    info: {
      title: "Book Review API",
      version: "0.1.0",
      description:
        "API HTTP (Hono) sobre os services de reviews e albums do Book Review. Sem autenticação ainda (fase 5).",
    },
  });

  app.get("/reference", Scalar({ url: "/api/doc" }));
} else {
  app.get("/doc", (c) => c.notFound());
  app.get("/reference", (c) => c.notFound());
}

export { routes as app };
export type { AppType };
