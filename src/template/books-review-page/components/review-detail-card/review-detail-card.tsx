"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAlbumBadgeColor } from "@/lib/album-badge-color";

import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ArrowLeftIcon, StarIcon, Trash2Icon } from "lucide-react";

function ReviewDetailCard({ review }: { review: BookReview[] }) {
  const pathname = usePathname();
  const reviewId = pathname.split("/").pop();

  const bookReview = review.find((review) => review.id === reviewId);

  const formattedBookDate = bookReview?.updatedAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const bookStars = Array.from({ length: 5 }).map((_, index) =>
    index < (bookReview?.rating ?? 0) ? (
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
                {bookReview?.title}
              </Text>
              <Text as="p" className="text-muted-foreground font-normal">
                {bookReview?.author}
              </Text>
            </div>

            <div className="p-1.5 rounded-sm text-muted-foreground transition-all hover:text-red-700 hover:bg-red-100">
              <Trash2Icon className="w-5 h-5" />
            </div>
          </CardTitle>

          <CardAction className="flex flex-wrap gap-3">
            <Badge
              key={bookReview?.categoryId}
              style={getAlbumBadgeColor(bookReview?.categoryId || "")}
            >
              {bookReview?.categoryId}
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
            {bookReview?.description}
          </Text>
        </CardContent>
      </Card>
    </div>
  );
}

export { ReviewDetailCard };
