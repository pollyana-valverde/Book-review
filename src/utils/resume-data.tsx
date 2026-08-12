import * as albumService from "@/server/modules/albums/album.service";
import * as reviewService from "@/server/modules/reviews/review.service";
import {
  BookOpenIcon,
  FolderOpenIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react";

async function getResumeData() {
  const [albums, reviews] = await Promise.all([
    albumService.list(),
    reviewService.getAll(),
  ]);
  const currentDate = new Date();

  const reviewsInThisMonth = reviews.filter((review) => {
    const reviewDate = new Date(review.createdAt);
    return (
      reviewDate.getMonth() === currentDate.getMonth() &&
      reviewDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const totalReviewRating =
    reviews.length > 0
      ? reviews.reduce(
          (accumulator, review) => accumulator + review.rating,
          0
        ) / reviews.length
      : 0;

  const resumeData = [
    {
      total: reviews.length,
      label: "Resenhas",
      iconComponent: {
        icon: BookOpenIcon,
        color: "bg-blue-50 text-blue-500",
      },
    },
    {
      total: albums.length,
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

  return resumeData;
}

export { getResumeData };
