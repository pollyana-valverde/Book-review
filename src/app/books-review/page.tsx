import { BooksReviewPage } from "@/template/books-review-page";
import { BooksReviewSearchParams } from "@/template/books-review-page/types";

export default async function BooksReview({
  searchParams,
}: {
  searchParams: Promise<BooksReviewSearchParams>;
}) {
  const rawParams = await searchParams;

  const title = Array.isArray(rawParams.title)
    ? rawParams.title[0]
    : rawParams.title;
  const category = Array.isArray(rawParams.category)
    ? rawParams.category[0]
    : rawParams.category;

  return <BooksReviewPage title={title} category={category} />;
}
