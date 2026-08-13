import "server-only";
import { Prisma } from "@/generated/prisma/client";
import * as albumRepository from "@/server/modules/albums/album.repository";
import {
  toAlbumDTO,
  toAlbumWithReviewCountDTO,
} from "@/server/modules/albums/album.mapper";
import type {
  AlbumDTO,
  AlbumWithReviewCountDTO,
  CreateAlbumInput,
} from "@/server/modules/albums/album.contract";
import { ConflictError, NotFoundError } from "@/server/lib/errors";

// Services recebem userId como primeiro parâmetro em vez de buscar a
// sessão sozinhos — quem tem a sessão é a borda (rotas/actions). Isso
// mantém os services testáveis sem precisar simular request/cookies.

async function list(userId: string): Promise<AlbumDTO[]> {
  const albums = await albumRepository.findMany(userId);
  return albums.map(toAlbumDTO);
}

async function listWithReviewCount(
  userId: string
): Promise<AlbumWithReviewCountDTO[]> {
  const albums = await albumRepository.findManyWithReviewCount(userId);
  return albums.map(toAlbumWithReviewCountDTO);
}

async function create(
  userId: string,
  data: CreateAlbumInput
): Promise<AlbumDTO> {
  try {
    const album = await albumRepository.create({ ...data, userId });
    return toAlbumDTO(album);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictError("Você já tem um album com este título.");
    }
    throw error;
  }
}

async function remove(userId: string, id: string) {
  try {
    const { count } = await albumRepository.remove(userId, id);

    if (count === 0) {
      throw new NotFoundError("Álbum não encontrado.");
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    // P2003: violação de foreign key. Com onDelete: Restrict em
    // Review.category, apagar um álbum que ainda tem resenhas dentro é
    // recusado pelo banco em vez de apagar as resenhas em cascata.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new ConflictError(
        "Este álbum tem resenhas. Mova ou apague as resenhas antes."
      );
    }

    throw error;
  }
}

export { list, listWithReviewCount, create, remove };
