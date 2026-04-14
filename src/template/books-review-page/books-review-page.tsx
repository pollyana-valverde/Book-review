import { Text } from "@/components/ui/text";
import { ReviewList, SearchSection } from "./components";
import { prisma } from "@/lib/prisma";

async function BooksReviewPage() {
  const review = await prisma.review.findMany();
  const albums = await prisma.album.findMany();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Text as="h1" variant="heading-1">
          Resenhas
        </Text>
        <Text as="p" className="text-muted-foreground">
          Todas as suas resenhas de livros
        </Text>
      </div>
      <SearchSection albums={albums} />
      <ReviewList review={review} />
    </div>
  );
}

export { BooksReviewPage };
