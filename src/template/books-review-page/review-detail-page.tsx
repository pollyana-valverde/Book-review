import { prisma } from "@/lib/prisma";

import { ReviewDetailCard } from "@/template/books-review-page/components/review-detail-card";

async function ReviewDetailPage() {
  const review = await prisma.review.findMany();

  return <ReviewDetailCard review={review} />;
}

export { ReviewDetailPage };
