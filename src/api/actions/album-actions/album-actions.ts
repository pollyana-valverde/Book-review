"use server";

import { prisma } from "@/lib/prisma";
import z from "zod";

const albumFormSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
});

type AlbumData = z.infer<typeof albumFormSchema>;

async function createAlbum(
  data: AlbumData
): Promise<{ success: boolean; error?: string }> {
  try {
    const parsedData = albumFormSchema.parse(data);

    const existingAlbum = await prisma.album.findFirst({
      where: {
        title: parsedData.title,
      },
    });

    if (existingAlbum) {
      return { success: false, error: "Você já tem um álbum com este título." };
    }

    await prisma.album.create({
      data: {
        ...parsedData,
      },
    });
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Erro ao criar álbum." };
  }
}

export { createAlbum };
