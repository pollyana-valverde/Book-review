import { ResumeCard } from "@/features/home/components/resume-card";

import { getResumeData } from "@/features/home/http/resume-data";

async function ResumeList() {
  const resumeData = await getResumeData();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {resumeData.map((resume, index) => (
        <ResumeCard key={`${resume.label}-${index}`} resume={resume} />
      ))}
    </div>
  );
}

export { ResumeList };
