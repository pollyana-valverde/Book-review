import { prisma } from "@/lib/prisma";

async function fetchReviews() {
  return await prisma.review.findMany();
}

async function fetchReviewById(id: string) {
  return await prisma.review.findUnique({
    where: {
      id: id,
    },
    include: {
      category: {
        select: {
          title: true,
        },
      },
    },
  });
}

async function fetchFirstReview(key: string, value: string) {
  return await prisma.review.findFirst({
    where: {
      [key]: value,
    },
  });
}

async function fetchFilteredReview(
  normalizedTitle: string,
  normalizedCategory?: string
) {
  return await prisma.review.findMany({
    where: {
      title: {
        contains: normalizedTitle,
        mode: "insensitive",
      },
      categoryId: normalizedCategory,
    },
    include: {
      category: {
        select: {
          title: true,
        },
      },
    },
  });
}

async function fetchTakeReviews(value: number) {
  return await prisma.review.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: value,
    include: {
      category: {
        select: {
          title: true,
        },
      },
    },
  });
}

export {
  fetchReviews,
  fetchFirstReview,
  fetchFilteredReview,
  fetchReviewById,
  fetchTakeReviews,
};
