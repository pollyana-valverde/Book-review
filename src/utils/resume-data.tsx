import { prisma } from "@/lib/prisma";

import {
  BookOpenIcon,
  FolderOpenIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react";

const reviews = async () => await prisma.review.findMany();
const reviewsInThisMonth = (await reviews()).filter((review) => {
  const reviewDate = new Date(review.createdAt);
  const currentDate = new Date();
  return (
    reviewDate.getMonth() === currentDate.getMonth() &&
    reviewDate.getFullYear() === currentDate.getFullYear()
  );
});
const albums = async () => await prisma.album.findMany();

const totalReviewRating =
  (await reviews()).length > 0
    ? (await reviews()).reduce(
        (accumulator, review) => accumulator + review.rating,
        0
      ) / (await reviews()).length
    : 0;

const RESUME_DATA = [
  {
    total: (await reviews()).length,
    label: "Resenhas",
    iconComponent: {
      icon: BookOpenIcon,
      color: "bg-blue-50 text-blue-500",
    },
  },
  {
    total: (await albums()).length,
    label: "Albums",
    iconComponent: {
      icon: FolderOpenIcon,
      color: "bg-purple-50 text-purple-500",
    },
  },
  {
    total: Number(totalReviewRating.toFixed(1)),
    label: "Nota Média",
    iconComponent: {
      icon: StarIcon,
      color: "bg-yellow-50 text-yellow-500",
    },
  },
  {
    total: reviewsInThisMonth.length,
    label: "Este mês",
    iconComponent: {
      icon: TrendingUpIcon,
      color: "bg-green-50 text-green-500",
    },
  },
];

export { RESUME_DATA };
