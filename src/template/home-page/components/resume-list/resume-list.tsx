import { ResumeCard } from "@/template/home-page/components/resume-card";

import { RESUME_DATA } from "@/utils/resume-data";

function ResumeList() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {RESUME_DATA.map((resume, index) => (
        <ResumeCard key={`${resume.label}-${index}`} resume={resume} />
      ))}
    </div>
  );
}

export { ResumeList };
