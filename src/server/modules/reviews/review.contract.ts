import z from "zod";

const createReviewSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  author: z.string().min(1, "O autor é obrigatório"),
  collectionId: z.string().min(1, "A coleção é obrigatória"),
  rating: z
    .number()
    .min(1, "A avaliação é obrigatória")
    .max(5, "A avaliação deve ser entre 1 e 5"),
  description: z
    .string()
    .min(1, "A resenha é obrigatória")
    .max(280, "A resenha deve ter no máximo 280 caracteres"),
});

const updateReviewSchema = createReviewSchema.partial();

const listReviewsQuerySchema = z.object({
  title: z.string().optional(),
  collectionId: z.string().optional(),
  cursor: z.string().optional(),
  // z.coerce: a mesma schema valida tanto chamadas diretas de service (number)
  // quanto query string HTTP via zValidator (sempre string).
  limit: z.coerce.number().int().positive().max(100).default(24),
});

const reviewDTOSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  rating: z.number(),
  collectionId: z.string(),
  collectionTitle: z.string(),
  updatedAt: z.string(),
});

type CreateReviewInput = z.infer<typeof createReviewSchema>;
type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
type ListReviewsQuery = z.infer<typeof listReviewsQuerySchema>;
type ReviewDTO = z.infer<typeof reviewDTOSchema>;

export {
  createReviewSchema,
  updateReviewSchema,
  listReviewsQuerySchema,
  reviewDTOSchema,
  type CreateReviewInput,
  type UpdateReviewInput,
  type ListReviewsQuery,
  type ReviewDTO,
};
