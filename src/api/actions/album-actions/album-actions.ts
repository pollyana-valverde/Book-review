"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
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

    revalidatePath("/albums");

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Erro ao criar álbum." };
  }
}

async function deleteAlbum(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.album.delete({
      where: {
        id,
      },
    });

    revalidatePath("/albums");

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Erro ao deletar álbum." };
  }
}

export { createAlbum, deleteAlbum };
