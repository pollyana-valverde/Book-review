import * as albumService from "@/server/modules/albums/album.service";
import * as reviewService from "@/server/modules/reviews/review.service";

import { Text } from "@/components/ui/text";
import { ReviewList } from "@/template/books-review-page/components/review-list";
import { SearchSection } from "@/template/books-review-page/components/review-search";

async function BooksReviewHeader() {
  const albums = await albumService.list();

  return (
    <>
      <div>
        <Text as="h1" variant="heading-1">
          Resenhas
        </Text>
        <Text as="p" className="text-muted-foreground">
          Todas as suas resenhas de livros
        </Text>
      </div>
      <SearchSection albums={albums} />
    </>
  );
}

async function ReviewListSection({
  title,
  category,
}: {
  title?: string;
  category?: string;
}) {
  const { items } = await reviewService.list({ title, categoryId: category });

  return <ReviewList reviewsList={items} />;
}

export { BooksReviewHeader, ReviewListSection };
