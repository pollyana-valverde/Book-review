import "server-only";
import { z } from "@hono/zod-openapi";

/**
 * Formato de erro compartilhado por toda a API (ver
 * src/server/api/middlewares/error-handler.ts). Definido uma vez e
 * referenciado em `responses` de cada rota — nenhuma rota deve inventar seu
 * próprio shape de erro.
 */
const errorSchema = z
  .object({
    error: z.object({
      code: z.string().openapi({ example: "NOT_FOUND" }),
      message: z.string().openapi({ example: "Recurso não encontrado." }),
    }),
  })
  .openapi("Error");

export { errorSchema };
