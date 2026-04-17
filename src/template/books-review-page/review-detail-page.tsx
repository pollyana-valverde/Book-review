import { fetchReviewById } from "@/api/services/book-reviews-services";
import Link from "next/link";
import { getAlbumBadgeColor } from "@/lib/album-badge-color";
import { notFound } from "next/navigation";

import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ArrowLeftIcon, StarIcon } from "lucide-react";

import { ReviewDTO } from "@/template/books-review-page/types";

async function ReviewDetailPage({ id }: { id: ReviewDTO["id"] }) {
  if (!id) {
    notFound();
  }

  const review = await fetchReviewById(id);

  if (!review) {
    notFound();
  }

  const reviewDetail: ReviewDTO = {
    id: review.id,
    title: review.title,
    author: review.author,
    description: review.description,
    rating: review.rating,
    categoryId: review.categoryId,
    categoryTitle: review.category.title,
    updatedAt: review.updatedAt.toISOString(),
  };

  const formattedBookDate = new Date(reviewDetail.updatedAt).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  const bookStars = Array.from({ length: 5 }).map((_, index) =>
    index < reviewDetail.rating ? (
      <StarIcon className="text-amber-400 fill-amber-400 w-4 h-4" key={index} />
    ) : (
      <StarIcon className="text-border w-4 h-4" key={index} />
    )
  );

  return (
    <div className="grid gap-4">
      <Link
        href="/books-review"
        className="flex gap-2 items-center cursor-pointer hover:text-foreground text-muted-foreground font-bold transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <Text variant="content-1">Voltar</Text>
      </Link>

      <Card className="w-full">
        <CardHeader className="flex flex-col gap-3">
          <CardTitle className="flex justify-between items-start gap-4 w-full">
            <div className="flex flex-col">
              <Text as="h2" variant="heading-1" className="truncate">
                {reviewDetail.title}
              </Text>
              <Text as="p" className="text-muted-foreground font-normal">
                {reviewDetail.author}
              </Text>
            </div>
          </CardTitle>

          <CardAction className="flex flex-wrap gap-3">
            <Badge
              key={reviewDetail.categoryId}
              style={getAlbumBadgeColor(reviewDetail.categoryId)}
            >
              {reviewDetail.categoryTitle}
            </Badge>

            <div className="flex gap-0.5 items-center">{bookStars}</div>

            <Text variant="content-1" className="text-muted-foreground">
              {formattedBookDate}
            </Text>
          </CardAction>
        </CardHeader>

        <CardContent>
          <Text
            as="p"
            className="text-muted-foreground leading-normal md:leading-relaxed"
          >
            {reviewDetail.description}
          </Text>
        </CardContent>
      </Card>
    </div>
  );
}

export { ReviewDetailPage };
