import { ResumeCard } from "../resume-card";
import {
  BookOpenIcon,
  FolderOpenIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react";

const resumeData = [
  {
    total: 8,
    label: "Resenhas Criadas",
    iconComponent: {
      icon: BookOpenIcon,
      color: "bg-blue-50 text-blue-500",
    },
  },
  {
    total: 6,
    label: "Resenhas Criadas",
    iconComponent: {
      icon: FolderOpenIcon,
      color: "bg-purple-50 text-purple-500",
    },
  },
  {
    total: 4.5,
    label: "Resenhas Criadas",
    iconComponent: {
      icon: StarIcon,
      color: "bg-yellow-50 text-yellow-500",
    },
  },
  {
    total: 4,
    label: "Resenhas Criadas",
    iconComponent: {
      icon: TrendingUpIcon,
      color: "bg-green-50 text-green-500",
    },
  },
];

function ResumeList() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
      {resumeData.map((resume, index) => (
        <ResumeCard key={`${resume.label}-${index}`} resume={resume} />
      ))}
    </div>
  );
}

export { ResumeList };
