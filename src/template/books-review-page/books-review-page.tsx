import { Text } from "@/components/ui/text";
import { BooksCards, SearchSection } from "./sections";

function BooksReviewPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Text as="h1" variant="heading-1">
          Resenhas
        </Text>
        <Text as="p" className="text-muted-foreground">
          Encontre e compartilhe suas resenhas de livros favoritos
        </Text>
      </div>
      <SearchSection />
      <BooksCards />
    </div>
  );
}

export { BooksReviewPage };
