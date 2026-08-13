import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

const albumWithReviewCountInclude = {
  _count: { select: { reviews: true } },
} satisfies Prisma.AlbumInclude;

async function findMany(userId: string) {
  return prisma.album.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

async function findManyWithReviewCount(userId: string) {
  return prisma.album.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: albumWithReviewCountInclude,
  });
}

/**
 * Usado pelo review.service para validar, antes de criar uma resenha, que
 * o álbum informado pertence ao mesmo usuário — sem isso alguém consegue
 * colocar uma resenha dentro do álbum de outra pessoa.
 */
async function findById(userId: string, id: string) {
  return prisma.album.findFirst({ where: { id, userId } });
}

async function create(data: { title: string; userId: string }) {
  return prisma.album.create({ data });
}

/**
 * `deleteMany` com `where: { id, userId }` de propósito — ver o comentário
 * equivalente em review.repository.ts.
 */
async function remove(userId: string, id: string) {
  return prisma.album.deleteMany({ where: { id, userId } });
}

export {
  albumWithReviewCountInclude,
  findMany,
  findManyWithReviewCount,
  findById,
  create,
  remove,
};
