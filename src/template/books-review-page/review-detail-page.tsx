import { prisma } from "@/lib/prisma";
import { ReviewDetailCard } from "./components";

async function ReviewDetailPage() {
  const review = await prisma.review.findMany();

  return <ReviewDetailCard review={review} />;
}

export { ReviewDetailPage };
