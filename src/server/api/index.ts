import "server-only";
import { Hono } from "hono";
import { prisma } from "@/server/db/prisma";
import { errorHandler } from "@/server/api/middlewares/error-handler";
import { reviewRoutes } from "@/server/modules/reviews/review.routes";
import { albumRoutes } from "@/server/modules/albums/album.routes";
import type { AppEnv } from "@/server/api/factory";

const app = new Hono<AppEnv>().basePath("/api").onError(errorHandler);

// Armadilha do RPC do Hono: os `.route()` PRECISAM ficar encadeados nesta
// única expressão, atribuída a uma variável (`routes`), e é dela que o
// AppType é inferido — se algum `.route()` virar um statement separado, o
// AppType perde essas rotas e o cliente RPC vira `any` sem erro de build.
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

export { routes as app };
export type { AppType };
