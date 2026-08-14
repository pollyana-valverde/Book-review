import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

const collectionWithReviewCountInclude = {
  _count: { select: { reviews: true } },
} satisfies Prisma.CollectionInclude;

async function findMany(userId: string) {
  return prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

async function findManyWithReviewCount(userId: string) {
  return prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: collectionWithReviewCountInclude,
  });
}

/**
 * Usado pelo review.service para validar, antes de criar uma resenha, que
 * a coleção informada pertence ao mesmo usuário — sem isso alguém consegue
 * colocar uma resenha dentro da coleção de outra pessoa.
 */
async function findById(userId: string, id: string) {
  return prisma.collection.findFirst({ where: { id, userId } });
}

async function create(data: { title: string; userId: string }) {
  return prisma.collection.create({ data });
}

/**
 * `deleteMany` com `where: { id, userId }` de propósito — ver o comentário
 * equivalente em review.repository.ts.
 */
async function remove(userId: string, id: string) {
  return prisma.collection.deleteMany({ where: { id, userId } });
}

export {
  collectionWithReviewCountInclude,
  findMany,
  findManyWithReviewCount,
  findById,
  create,
  remove,
};
