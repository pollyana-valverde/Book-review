import z from "zod";

// Validação estrutural leve: só confirma que parece um documento
// Tiptap/ProseMirror (`type: "doc"` + `content` opcional). A validação de
// verdade — reconstruir a árvore contra o schema das extensões do editor —
// é feita no servidor por `sanitizeRichText` (src/server/lib/rich-text.ts),
// não aqui. `contentText`/`excerpt` NÃO entram neste schema de propósito:
// são derivados no servidor, o cliente nunca os envia.
const richTextContentSchema = z
  .object({
    type: z.literal("doc"),
    content: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .loose();

const createReviewSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  author: z.string().min(1, "O autor é obrigatório"),
  collectionId: z.string().min(1, "A coleção é obrigatória"),
  rating: z
    .number()
    .min(1, "A avaliação é obrigatória")
    .max(5, "A avaliação deve ser entre 1 e 5"),
  content: richTextContentSchema,
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
  content: richTextContentSchema,
  excerpt: z.string(),
  rating: z.number(),
  collectionId: z.string(),
  collectionTitle: z.string(),
  updatedAt: z.string(),
});

type CreateReviewInput = z.infer<typeof createReviewSchema>;
type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
type ListReviewsQuery = z.infer<typeof listReviewsQuerySchema>;
type ReviewDTO = z.infer<typeof reviewDTOSchema>;
type RichTextContent = z.infer<typeof richTextContentSchema>;

export {
  createReviewSchema,
  updateReviewSchema,
  listReviewsQuerySchema,
  reviewDTOSchema,
  richTextContentSchema,
  type CreateReviewInput,
  type UpdateReviewInput,
  type ListReviewsQuery,
  type ReviewDTO,
  type RichTextContent,
};
