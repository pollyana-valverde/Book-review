import "server-only";
import { Prisma } from "@/generated/prisma/client";
import * as reviewRepository from "@/server/modules/reviews/review.repository";
import * as albumRepository from "@/server/modules/albums/album.repository";
import { toReviewDTO } from "@/server/modules/reviews/review.mapper";
import {
  listReviewsQuerySchema,
  type CreateReviewInput,
  type UpdateReviewInput,
  type ReviewDTO,
} from "@/server/modules/reviews/review.contract";
import { ConflictError, NotFoundError } from "@/server/lib/errors";

// Services recebem userId como primeiro parâmetro em vez de buscar a
// sessão sozinhos — quem tem a sessão é a borda (rotas/actions). Isso
// mantém os services testáveis sem precisar simular request/cookies.

function normalizeCategoryId(categoryId?: string) {
  return categoryId && categoryId !== "all" ? categoryId : undefined;
}

async function list(
  userId: string,
  rawQuery: {
    title?: string;
    categoryId?: string;
    cursor?: string;
    limit?: number;
  }
): Promise<{ items: ReviewDTO[]; nextCursor: string | null }> {
  const query = listReviewsQuerySchema.parse(rawQuery);
  const title = query.title?.trim() || undefined;
  const categoryId = normalizeCategoryId(query.categoryId);

  const reviews = await reviewRepository.findMany({
    userId,
    title,
    categoryId,
    cursor: query.cursor,
    limit: query.limit,
  });

  const hasNextPage = reviews.length > query.limit;
  const page = hasNextPage ? reviews.slice(0, query.limit) : reviews;
  const items = page.map(toReviewDTO);
  const nextCursor = hasNextPage ? items[items.length - 1].id : null;

  return { items, nextCursor };
}

async function listRecent(userId: string, limit: number): Promise<ReviewDTO[]> {
  const reviews = await reviewRepository.findRecent(userId, limit);
  return reviews.map(toReviewDTO);
}

async function getAll(userId: string) {
  return reviewRepository.findAll(userId);
}

async function getById(userId: string, id: string): Promise<ReviewDTO> {
  const review = await reviewRepository.findById(userId, id);

  if (!review) {
    throw new NotFoundError("Resenha não encontrada.");
  }

  return toReviewDTO(review);
}

async function create(
  userId: string,
  data: CreateReviewInput
): Promise<ReviewDTO> {
  // Sem isso, alguém consegue colocar uma resenha dentro do álbum de outra
  // pessoa só sabendo o id do álbum.
  const album = await albumRepository.findById(userId, data.categoryId);

  if (!album) {
    throw new NotFoundError("Álbum não encontrado.");
  }

  try {
    const review = await reviewRepository.create({ ...data, userId });
    return toReviewDTO(review);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictError("Você já escreveu uma resenha para este livro.");
    }
    throw error;
  }
}

async function update(
  userId: string,
  id: string,
  data: UpdateReviewInput
): Promise<ReviewDTO> {
  if (data.categoryId) {
    const album = await albumRepository.findById(userId, data.categoryId);

    if (!album) {
      throw new NotFoundError("Álbum não encontrado.");
    }
  }

  try {
    const { count } = await reviewRepository.update(userId, id, data);

    if (count === 0) {
      throw new NotFoundError("Resenha não encontrada.");
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictError("Você já escreveu uma resenha para este livro.");
    }

    throw error;
  }

  const review = await reviewRepository.findById(userId, id);

  // Não deveria acontecer (acabamos de confirmar count === 1 acima), mas o
  // tipo de findById é nulável.
  if (!review) {
    throw new NotFoundError("Resenha não encontrada.");
  }

  return toReviewDTO(review);
}

async function remove(userId: string, id: string) {
  const { count } = await reviewRepository.remove(userId, id);

  if (count === 0) {
    throw new NotFoundError("Resenha não encontrada.");
  }
}

export { list, listRecent, getAll, getById, create, update, remove };
