import "server-only";
import { Prisma } from "@/generated/prisma/client";
import * as collectionRepository from "@/server/modules/collections/collection.repository";
import {
  toCollectionDTO,
  toCollectionWithReviewCountDTO,
} from "@/server/modules/collections/collection.mapper";
import type {
  CollectionDTO,
  CollectionWithReviewCountDTO,
  CreateCollectionInput,
} from "@/server/modules/collections/collection.contract";
import { ConflictError, NotFoundError } from "@/server/lib/errors";

// Services recebem userId como primeiro parâmetro em vez de buscar a
// sessão sozinhos — quem tem a sessão é a borda (rotas/actions). Isso
// mantém os services testáveis sem precisar simular request/cookies.

async function list(userId: string): Promise<CollectionDTO[]> {
  const collections = await collectionRepository.findMany(userId);
  return collections.map(toCollectionDTO);
}

async function listWithReviewCount(
  userId: string
): Promise<CollectionWithReviewCountDTO[]> {
  const collections = await collectionRepository.findManyWithReviewCount(userId);
  return collections.map(toCollectionWithReviewCountDTO);
}

async function create(
  userId: string,
  data: CreateCollectionInput
): Promise<CollectionDTO> {
  try {
    const collection = await collectionRepository.create({ ...data, userId });
    return toCollectionDTO(collection);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictError("Você já tem uma coleção com este título.");
    }
    throw error;
  }
}

async function remove(userId: string, id: string) {
  try {
    const { count } = await collectionRepository.remove(userId, id);

    if (count === 0) {
      throw new NotFoundError("Coleção não encontrada.");
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    // P2003: violação de foreign key. Com onDelete: Restrict em
    // Review.category, apagar uma coleção que ainda tem resenhas dentro é
    // recusado pelo banco em vez de apagar as resenhas em cascata.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new ConflictError(
        "Esta coleção tem resenhas. Mova ou apague as resenhas antes."
      );
    }

    throw error;
  }
}

export { list, listWithReviewCount, create, remove };
