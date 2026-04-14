import { ReviewDetailPage } from "@/template/books-review-page";

export default async function ReviewDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: reviewId } = await params;

  return <ReviewDetailPage id={reviewId} />;
}
