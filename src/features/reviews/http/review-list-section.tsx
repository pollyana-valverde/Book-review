import { getCollections } from "@/server/modules/collections/collection.queries";
import { getReviews } from "@/server/modules/reviews/review.queries";
import { getSession } from "@/server/auth/session";

import { Text } from "@/components/ui/text";
import { ReviewList } from "@/features/reviews/components/review-list";
import { SearchSection } from "@/features/reviews/components/review-search";

async function BooksReviewHeader() {
  const { user } = (await getSession())!;
  const collections = await getCollections(user.id);

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
      <SearchSection collections={collections} />
    </>
  );
}

async function ReviewListSection({
  title,
  collection,
}: {
  title?: string;
  collection?: string;
}) {
  const { user } = (await getSession())!;
  const { items, nextCursor } = await getReviews(user.id, {
    title,
    collectionId: collection,
  });

  return (
    <ReviewList
      reviewsList={items}
      nextCursor={nextCursor}
      title={title}
      collectionId={collection}
    />
  );
}

export { BooksReviewHeader, ReviewListSection };
