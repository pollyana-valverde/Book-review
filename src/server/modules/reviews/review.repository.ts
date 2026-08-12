import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

const reviewWithCategoryInclude = {
  category: { select: { title: true } },
} satisfies Prisma.ReviewInclude;

async function findMany(params: {
  title?: string;
  categoryId?: string;
  cursor?: string;
  limit: number;
}) {
  const { title, categoryId, cursor, limit } = params;

  return prisma.review.findMany({
    where: {
      title: title ? { contains: title, mode: "insensitive" } : undefined,
      categoryId,
    },
    include: reviewWithCategoryInclude,
    orderBy: { updatedAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });
}

async function findRecent(limit: number) {
  return prisma.review.findMany({
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: reviewWithCategoryInclude,
  });
}

async function findAll() {
  return prisma.review.findMany();
}

async function findById(id: string) {
  return prisma.review.findUnique({
    where: { id },
    include: reviewWithCategoryInclude,
  });
}

async function findByTitle(title: string) {
  return prisma.review.findFirst({
    where: { title },
  });
}

async function create(data: {
  title: string;
  author: string;
  categoryId: string;
  rating: number;
  description: string;
}) {
  return prisma.review.create({ data });
}

async function remove(id: string) {
  return prisma.review.delete({ where: { id } });
}

export {
  reviewWithCategoryInclude,
  findMany,
  findRecent,
  findAll,
  findById,
  findByTitle,
  create,
  remove,
};
