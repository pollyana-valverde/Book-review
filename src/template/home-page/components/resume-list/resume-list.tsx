import { prisma } from "@/lib/prisma";
import { ResumeCard } from "../resume-card";
import {
  BookOpenIcon,
  FolderOpenIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react";

const reviews = await prisma.review.findMany();
const reviewsInThisMonth = reviews.filter((review) => {
  const reviewDate = new Date(review.createdAt);
  const currentDate = new Date();
  return (
    reviewDate.getMonth() === currentDate.getMonth() &&
    reviewDate.getFullYear() === currentDate.getFullYear()
  );
});
const albums = await prisma.album.findMany();

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
    label: "Álbums",
    iconComponent: {
      icon: FolderOpenIcon,
      color: "bg-purple-50 text-purple-500",
    },
  },
  {
    total:
      reviews.length > 0
        ? reviews.reduce(
            (accumulator, review) => accumulator + review.rating,
            0
          ) / reviews.length
        : 0,
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

function ResumeList() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {resumeData.map((resume, index) => (
        <ResumeCard key={`${resume.label}-${index}`} resume={resume} />
      ))}
    </div>
  );
}

export { ResumeList };
