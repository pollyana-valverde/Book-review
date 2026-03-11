import { BooksCards } from "@/components/books-page/books-cards";
import { Text } from "@/components/ui/text";

export default function Books() {
  return (
    <div>
      <Text className="mb-2" as="h1" variant="heading-1">
        Todos os livros
      </Text>
      <BooksCards />
    </div>
  );
}
