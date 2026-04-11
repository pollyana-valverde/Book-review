import { Text } from "@/components/ui/text";
import { RecentReviewList, ResumeList, AlbumsBooksList } from "./components";

function HomePage() {
  return (
    <div className="flex flex-col gap-7">
      <div>
        <Text as="h1" variant="heading-1">
          Dashboard
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
            Álbuns
          </Text>
          <AlbumsBooksList />
        </div>
      </div>
    </div>
  );
}

export { HomePage };
