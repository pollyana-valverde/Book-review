import "server-only";
// Side effect: registra a extensão `.openapi()` no protótipo do ZodType do
// pacote "zod" (mesma classe usada pelos schemas puros do contract). Não
// precisamos de nenhum binding daqui — só do registro acontecer antes das
// chamadas `.openapi()` abaixo.
import "@hono/zod-openapi";
import z from "zod";
import {
  createReviewSchema,
  updateReviewSchema,
  listReviewsQuerySchema,
  reviewDTOSchema,
} from "@/server/modules/reviews/review.contract";

/**
 * Metadados OpenAPI para o módulo de reviews. Fica fora de review.contract.ts
 * de propósito: os contracts continuam em Zod puro (sem import de
 * @hono/zod-openapi) porque o front os importa para validar formulários com
 * zodResolver — se a extensão OpenAPI entrasse no contract, a lib inteira
 * iria para o bundle do cliente.
 */

const reviewIdParamSchema = z.object({
  id: z.string().openapi({
    param: { name: "id", in: "path" },
    example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  }),
});

const reviewResponseSchema = reviewDTOSchema.openapi("Review", {
  description: "Uma resenha de livro",
});

const reviewsListResponseSchema = z
  .object({
    items: z.array(reviewDTOSchema),
    nextCursor: z.string().nullable(),
  })
  .openapi("ReviewsList", { description: "Página de resenhas" });

const createReviewBodySchema = createReviewSchema.openapi("CreateReview");
const updateReviewBodySchema = updateReviewSchema.openapi("UpdateReview");
const listReviewsQueryOpenApiSchema = listReviewsQuerySchema.openapi(
  "ListReviewsQuery"
);

export {
  reviewIdParamSchema,
  reviewResponseSchema,
  reviewsListResponseSchema,
  createReviewBodySchema,
  updateReviewBodySchema,
  listReviewsQueryOpenApiSchema,
};
