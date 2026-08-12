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

async function list(): Promise<AlbumDTO[]> {
  const albums = await albumRepository.findMany();
  return albums.map(toAlbumDTO);
}

async function listWithReviewCount(): Promise<AlbumWithReviewCountDTO[]> {
  const albums = await albumRepository.findManyWithReviewCount();
  return albums.map(toAlbumWithReviewCountDTO);
}

async function create(data: CreateAlbumInput) {
  try {
    await albumRepository.create(data);
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

async function remove(id: string) {
  try {
    await albumRepository.remove(id);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundError("Álbum não encontrado.");
    }
    throw error;
  }
}

export { list, listWithReviewCount, create, remove };
