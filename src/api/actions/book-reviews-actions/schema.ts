import z from "zod";

const reviewDataSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  author: z.string().min(1, "O autor é obrigatório"),
  categoryId: z.string().min(1, "O álbum é obrigatório"),
  rating: z
    .number()
    .min(1, "A avaliação é obrigatória")
    .max(5, "A avaliação deve ser entre 1 e 5"),
  description: z
    .string()
    .min(1, "A resenha é obrigatória")
    .max(280, "A resenha deve ter no máximo 280 caracteres"),
});

type ReviewDataValues = z.infer<typeof reviewDataSchema>;

export { reviewDataSchema, type ReviewDataValues };
