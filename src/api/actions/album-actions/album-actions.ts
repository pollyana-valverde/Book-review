"use server";

import { prisma } from "@/lib/prisma";
import { fetchFirstAlbum } from "@/api/services/album-services";
import { revalidatePath } from "next/cache";
import { AlbumDataValues, albumDataSchema } from "./schema";

import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

async function createAlbum(
  data: AlbumDataValues
): Promise<{ success: boolean; error?: string }> {
  try {
    const parsedData = albumDataSchema.parse(data);

    const existingAlbum = await fetchFirstAlbum("title", parsedData.title);

    if (existingAlbum) {
      return { success: false, error: "Você já tem um album com este título." };
    }

    await prisma.album.create({
      data: parsedData,
    });

    revalidatePath("/albums");

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
        return { success: false, error: "Já existe um álbum com este título." };
      }
      return { success: false, error: "Erro ao criar álbum. Tente novamente." };
    }

    // Erro genérico
    return { success: false, error: "Erro ao criar album." };
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
    console.error(error);

    // Prisma - erro conhecido (ex: registro não encontrado)
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return { success: false, error: "Álbum não encontrado." };
      }
    }

    return { success: false, error: "Erro ao deletar album." };
  }
}

export { createAlbum, deleteAlbum };
