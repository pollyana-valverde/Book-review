"use server";

import { prisma } from "@/lib/prisma";
import z from "zod";

const albumFormSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
});

type AlbumData = z.infer<typeof albumFormSchema>;

async function createAlbum(data: AlbumData) {
  try {
    const parsedData = albumFormSchema.parse(data);

    const existingAlbum = await prisma.album.findFirst({
      where: {
        title: parsedData.title,
      },
    });

    if (existingAlbum) {
      return { error: "Você já tem um álbum com este título." };
    }

    await prisma.album.create({
      data: {
        ...parsedData,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export { createAlbum };
