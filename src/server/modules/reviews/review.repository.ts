import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

const reviewWithCollectionInclude = {
  collection: { select: { title: true } },
} satisfies Prisma.ReviewInclude;

async function findMany(params: {
  userId: string;
  title?: string;
  collectionId?: string;
  cursor?: string;
  limit: number;
}) {
  const { userId, title, collectionId, cursor, limit } = params;

  return prisma.review.findMany({
    where: {
      userId,
      collectionId,
      // Busca por título OU pelo texto puro derivado do conteúdo — ver
      // nota de dívida técnica no relatório da fase 8: sem índice em
      // content_text, o ILIKE (`contains`) faz um scan completo e fica
      // lento com volume.
      ...(title
        ? {
            OR: [
              { title: { contains: title, mode: "insensitive" } },
              { contentText: { contains: title, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: reviewWithCollectionInclude,
    orderBy: { updatedAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });
}

async function findRecent(userId: string, limit: number) {
  return prisma.review.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: reviewWithCollectionInclude,
  });
}

async function findAll(userId: string) {
  return prisma.review.findMany({ where: { userId } });
}

async function findById(userId: string, id: string) {
  return prisma.review.findFirst({
    where: { id, userId },
    include: reviewWithCollectionInclude,
  });
}

async function create(data: {
  title: string;
  author: string;
  collectionId: string;
  rating: number;
  content: Prisma.InputJsonValue;
  contentText: string;
  excerpt: string;
  userId: string;
}) {
  return prisma.review.create({ data, include: reviewWithCollectionInclude });
}

/**
 * `updateMany`/`deleteMany` com `where: { id, userId }` de propósito (não
 * `update`/`delete`, que exigem where único): se `count` voltar 0, o
 * chamador não sabe dizer se o id não existe ou se é de outro usuário —
 * exatamente o que queremos, para nunca vazar essa distinção (ver
 * review.service.ts).
 */
async function update(
  userId: string,
  id: string,
  data: Partial<{
    title: string;
    author: string;
    collectionId: string;
    rating: number;
    content: Prisma.InputJsonValue;
    contentText: string;
    excerpt: string;
  }>
) {
  return prisma.review.updateMany({
    where: { id, userId },
    data,
  });
}

async function remove(userId: string, id: string) {
  return prisma.review.deleteMany({
    where: { id, userId },
  });
}

export {
  reviewWithCollectionInclude,
  findMany,
  findRecent,
  findAll,
  findById,
  create,
  update,
  remove,
};
