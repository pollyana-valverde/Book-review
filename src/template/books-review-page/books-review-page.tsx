import { fetchAlbums } from "@/api/services/album-services";
import { fetchFilteredReview } from "@/api/services/book-reviews-services";

import { Text } from "@/components/ui/text";
import { ReviewList } from "@/template/books-review-page/components/review-list";
import { SearchSection } from "@/template/books-review-page/components/review-search";

import { ReviewDTO } from "@/template/books-review-page/types";

async function BooksReviewHeader() {
  const albums = await fetchAlbums();

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
  title?: ReviewDTO["title"];
  category?: Album["id"];
}) {
  const normalizedTitle = title?.trim() ?? "";
  const normalizedCategory =
    category && category !== "all" ? category : undefined;

  const review = await fetchFilteredReview(normalizedTitle, normalizedCategory);

  const bookReviews: ReviewDTO[] = review.map((r) => ({
    id: r.id,
    title: r.title,
    author: r.author,
    description: r.description,
    rating: r.rating,
    categoryId: r.categoryId,
    categoryTitle: r.category.title,
    updatedAt: r.updatedAt.toISOString(),
  }));

  return <ReviewList reviewsList={bookReviews} />;
}

export { BooksReviewHeader, ReviewListSection };
