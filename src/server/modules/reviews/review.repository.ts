import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

const reviewWithCategoryInclude = {
  category: { select: { title: true } },
} satisfies Prisma.ReviewInclude;

async function findMany(params: {
  userId: string;
  title?: string;
  categoryId?: string;
  cursor?: string;
  limit: number;
}) {
  const { userId, title, categoryId, cursor, limit } = params;

  return prisma.review.findMany({
    where: {
      userId,
      title: title ? { contains: title, mode: "insensitive" } : undefined,
      categoryId,
    },
    include: reviewWithCategoryInclude,
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
    include: reviewWithCategoryInclude,
  });
}

async function findAll(userId: string) {
  return prisma.review.findMany({ where: { userId } });
}

async function findById(userId: string, id: string) {
  return prisma.review.findFirst({
    where: { id, userId },
    include: reviewWithCategoryInclude,
  });
}

async function create(data: {
  title: string;
  author: string;
  categoryId: string;
  rating: number;
  description: string;
  userId: string;
}) {
  return prisma.review.create({ data, include: reviewWithCategoryInclude });
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
    categoryId: string;
    rating: number;
    description: string;
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
  reviewWithCategoryInclude,
  findMany,
  findRecent,
  findAll,
  findById,
  create,
  update,
  remove,
};
