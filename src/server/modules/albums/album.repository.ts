import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

const albumWithReviewCountInclude = {
  _count: { select: { reviews: true } },
} satisfies Prisma.AlbumInclude;

async function findMany() {
  return prisma.album.findMany({
    orderBy: { createdAt: "desc" },
  });
}

async function findManyWithReviewCount() {
  return prisma.album.findMany({
    orderBy: { createdAt: "desc" },
    include: albumWithReviewCountInclude,
  });
}

async function create(data: { title: string }) {
  return prisma.album.create({ data });
}

async function remove(id: string) {
  return prisma.album.delete({ where: { id } });
}

export {
  albumWithReviewCountInclude,
  findMany,
  findManyWithReviewCount,
  create,
  remove,
};
