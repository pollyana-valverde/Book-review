import { ResumeCard } from "../resume-card";
import {
  BookOpenIcon,
  FolderOpenIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react";

import { albumsList, booksReviewList } from "@/utils";

const resumeData = [
  {
    total: booksReviewList.length,
    label: "Resenhas",
    iconComponent: {
      icon: BookOpenIcon,
      color: "bg-blue-50 text-blue-500",
    },
  },
  {
    total: albumsList.length,
    label: "Álbums",
    iconComponent: {
      icon: FolderOpenIcon,
      color: "bg-purple-50 text-purple-500",
    },
  },
  {
    total:
      booksReviewList.length > 0
        ? booksReviewList.reduce(
            (accumulator, review) => accumulator + review.rating,
            0
          ) / booksReviewList.length
        : 0,
    label: "Nota Média",
    iconComponent: {
      icon: StarIcon,
      color: "bg-yellow-50 text-yellow-500",
    },
  },
  {
    total: 4,
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
