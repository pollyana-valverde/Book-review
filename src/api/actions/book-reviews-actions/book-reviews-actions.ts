"use server";

import { prisma } from "@/lib/prisma";
import { fetchFirstReview } from "@/api/services/book-reviews-services";
import { revalidatePath } from "next/cache";
import { reviewDataSchema, type ReviewDataValues } from "./schema";

import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

async function createReview(
  data: ReviewDataValues
): Promise<{ success: boolean; error?: string }> {
  try {
    const parsedData = reviewDataSchema.parse(data);

    const existingReview = await fetchFirstReview("title", parsedData.title);

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
    console.error(error);

    // ZodError - validação falhou
    if (error instanceof ZodError) {
      const messages = error.issues.map((issue) => issue.message);
      return { success: false, error: messages.join(", ") };
    }

    // Prisma - erro conhecido (ex: unique constraint)
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          error: "Já existe uma resenha para este livro.",
        };
      }
      return {
        success: false,
        error: "Erro ao criar resenha. Tente novamente.",
      };
    }

    // Erro genérico

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
    console.error(error);

    // Prisma - erro conhecido (ex: registro não encontrado)
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return { success: false, error: "Resenha não encontrada." };
      }
    }

    return { success: false, error: "Erro ao deletar resenha." };
  }
}

export { createReview, deleteReview };
