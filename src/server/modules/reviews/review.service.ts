import "server-only";
import { Prisma } from "@/generated/prisma/client";
import * as reviewRepository from "@/server/modules/reviews/review.repository";
import { toReviewDTO } from "@/server/modules/reviews/review.mapper";
import {
  listReviewsQuerySchema,
  type CreateReviewInput,
  type UpdateReviewInput,
  type ReviewDTO,
} from "@/server/modules/reviews/review.contract";
import { ConflictError, NotFoundError } from "@/server/lib/errors";

function normalizeCategoryId(categoryId?: string) {
  return categoryId && categoryId !== "all" ? categoryId : undefined;
}

async function list(rawQuery: {
  title?: string;
  categoryId?: string;
  cursor?: string;
  limit?: number;
}): Promise<{ items: ReviewDTO[]; nextCursor: string | null }> {
  const query = listReviewsQuerySchema.parse(rawQuery);
  const title = query.title?.trim() || undefined;
  const categoryId = normalizeCategoryId(query.categoryId);

  const reviews = await reviewRepository.findMany({
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

async function listRecent(limit: number): Promise<ReviewDTO[]> {
  const reviews = await reviewRepository.findRecent(limit);
  return reviews.map(toReviewDTO);
}

async function getAll() {
  return reviewRepository.findAll();
}

async function getById(id: string): Promise<ReviewDTO> {
  const review = await reviewRepository.findById(id);

  if (!review) {
    throw new NotFoundError("Resenha não encontrada.");
  }

  return toReviewDTO(review);
}

async function create(data: CreateReviewInput): Promise<ReviewDTO> {
  try {
    const review = await reviewRepository.create(data);
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

async function update(id: string, data: UpdateReviewInput): Promise<ReviewDTO> {
  try {
    const review = await reviewRepository.update(id, data);
    return toReviewDTO(review);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new NotFoundError("Resenha não encontrada.");
      }
      if (error.code === "P2002") {
        throw new ConflictError("Você já escreveu uma resenha para este livro.");
      }
    }
    throw error;
  }
}

async function remove(id: string) {
  try {
    await reviewRepository.remove(id);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundError("Resenha não encontrada.");
    }
    throw error;
  }
}

export { list, listRecent, getAll, getById, create, update, remove };
