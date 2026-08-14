import "server-only";
import { Prisma } from "@/generated/prisma/client";
import * as reviewRepository from "@/server/modules/reviews/review.repository";
import * as collectionRepository from "@/server/modules/collections/collection.repository";
import { toReviewDTO } from "@/server/modules/reviews/review.mapper";
import {
  listReviewsQuerySchema,
  type CreateReviewInput,
  type UpdateReviewInput,
  type ReviewDTO,
} from "@/server/modules/reviews/review.contract";
import { ConflictError, NotFoundError } from "@/server/lib/errors";
import { sanitizeRichText, toPlainText, toExcerpt } from "@/server/lib/rich-text";

// Services recebem userId como primeiro parâmetro em vez de buscar a
// sessão sozinhos — quem tem a sessão é a borda (rotas/actions). Isso
// mantém os services testáveis sem precisar simular request/cookies.

function normalizeCollectionId(collectionId?: string) {
  return collectionId && collectionId !== "all" ? collectionId : undefined;
}

async function list(
  userId: string,
  rawQuery: {
    title?: string;
    collectionId?: string;
    cursor?: string;
    limit?: number;
  }
): Promise<{ items: ReviewDTO[]; nextCursor: string | null }> {
  const query = listReviewsQuerySchema.parse(rawQuery);
  const title = query.title?.trim() || undefined;
  const collectionId = normalizeCollectionId(query.collectionId);

  const reviews = await reviewRepository.findMany({
    userId,
    title,
    collectionId,
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
  // Sem isso, alguém consegue colocar uma resenha dentro da coleção de
  // outra pessoa só sabendo o id da coleção.
  const collection = await collectionRepository.findById(userId, data.collectionId);

  if (!collection) {
    throw new NotFoundError("Coleção não encontrada.");
  }

  // sanitizeRichText é a validação de verdade (Zod só confirmou o
  // formato estrutural em review.contract.ts); contentText/excerpt são
  // SEMPRE derivados aqui, nunca aceitos do cliente.
  const content = sanitizeRichText(data.content);
  const contentText = toPlainText(content);
  const excerpt = toExcerpt(contentText);

  try {
    const review = await reviewRepository.create({
      title: data.title,
      author: data.author,
      collectionId: data.collectionId,
      rating: data.rating,
      content: content as Prisma.InputJsonValue,
      contentText,
      excerpt,
      userId,
    });
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
  if (data.collectionId) {
    const collection = await collectionRepository.findById(userId, data.collectionId);

    if (!collection) {
      throw new NotFoundError("Coleção não encontrada.");
    }
  }

  const { content: rawContent, ...rest } = data;
  const patch: Parameters<typeof reviewRepository.update>[2] = { ...rest };

  if (rawContent) {
    const content = sanitizeRichText(rawContent);
    const contentText = toPlainText(content);

    patch.content = content as Prisma.InputJsonValue;
    patch.contentText = contentText;
    patch.excerpt = toExcerpt(contentText);
  }

  try {
    const { count } = await reviewRepository.update(userId, id, patch);

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
