import { getAlbums } from "@/server/modules/albums/album.queries";
import { getReviews } from "@/server/modules/reviews/review.queries";
import { getSession } from "@/server/auth/session";

import { Text } from "@/components/ui/text";
import { ReviewList } from "@/template/books-review-page/components/review-list";
import { SearchSection } from "@/template/books-review-page/components/review-search";

async function BooksReviewHeader() {
  const { user } = (await getSession())!;
  const albums = await getAlbums(user.id);

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
  const { user } = (await getSession())!;
  const { items } = await getReviews(user.id, { title, categoryId: category });

  return <ReviewList reviewsList={items} />;
}

export { BooksReviewHeader, ReviewListSection };
