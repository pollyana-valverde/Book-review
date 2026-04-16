"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";

const reviewFormSchema = z.object({
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

type ReviewData = z.infer<typeof reviewFormSchema>;

async function createReview(
  data: ReviewData
): Promise<{ success: boolean; error?: string }> {
  try {
    const parsedData = reviewFormSchema.parse(data);

    const existingReview = await prisma.review.findFirst({
      where: {
        title: parsedData.title,
      },
    });

    if (existingReview) {
      return {
        success: false,
        error: "Você já escreveu uma resenha para este livro.",
      };
    }

    await prisma.review.create({
      data: {
        ...parsedData,
      },
    });

    revalidatePath("/books-review");

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Erro ao criar resenha." };
  }
}

async function deleteReview(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.review.delete({
      where: {
        id,
      },
    });

    revalidatePath("/books-review");

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Erro ao deletar resenha." };
  }
}

export { createReview, deleteReview };
