import { Suspense } from "react";

import { HomeSkeleton } from "@/features/home/components/home-skeleton";
import { Text } from "@/components/ui/text";
import { RecentReviewList } from "@/features/home/components/recent-review-list";
import { ResumeList } from "@/features/home/components/resume-list";
import { CollectionsBooksList } from "@/features/home/components/collections-books-list";

async function HomePageContent() {
  return (
    <div className="flex flex-col gap-7">
      <div>
        <Text as="h1" variant="heading-1">
          Painel
        </Text>
        <Text as="p" className="text-muted-foreground">
          Visão geral das suas resenhas
        </Text>
      </div>

      <ResumeList />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          <Text as="h3" variant="heading-3">
            Resenhas Recentes
          </Text>
          <RecentReviewList />
        </div>

        <div className="space-y-3">
          <Text as="h3" variant="heading-3">
            Coleções
          </Text>
          <CollectionsBooksList />
        </div>
      </div>
    </div>
  );
}

async function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
}

export { HomePage };
