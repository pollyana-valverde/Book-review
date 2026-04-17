import { prisma } from "@/lib/prisma";

async function fetchAlbums() {
  return await prisma.album.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function fetchAlbumsWithBookCount() {
  return await prisma.album.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });
}

async function fetchFirstAlbum(key: string, value: string) {
  return await prisma.album.findFirst({
    where: {
      [key]: value,
    },
  });
}

export { fetchFirstAlbum, fetchAlbumsWithBookCount, fetchAlbums };
