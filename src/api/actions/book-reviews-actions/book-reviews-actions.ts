"use server";

import { prisma } from "@/lib/prisma";
import z from "zod";

const reviewFormSchema = z.object({
  title: z.string(),
  author: z.string(),
  categoryId: z.string(),
  rating: z.number(),
  description: z.string(),
});

interface ReviewData extends z.infer<typeof reviewFormSchema> {}

async function createReview(data: ReviewData) {
  try {
    const parsedData = reviewFormSchema.parse(data);

    const existingReview = await prisma.review.findFirst({
      where: {
        title: parsedData.title,
      },
    });

    if (existingReview) {
      return { error: "Você já escreveu uma resenha para este livro." };
    }

    await prisma.review.create({
      data: {
        ...parsedData,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export { createReview };
