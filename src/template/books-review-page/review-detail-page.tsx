"use client";

import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { booksReviewList } from "@/utils/book-review-list";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, StarIcon, Trash2Icon } from "lucide-react";

function ReviewDetailPage() {
  const pathname = usePathname();
  const reviewId = pathname.split("/").pop();

  const review = booksReviewList.find((review) => review.id === reviewId);

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
                {review?.title}
              </Text>
              <Text
                as="p"
                variant="heading-3"
                className="text-muted-foreground font-normal"
              >
                {review?.author}
              </Text>
            </div>

            <div className="p-1.5 rounded-sm text-muted-foreground transition-all hover:text-red-700 hover:bg-red-100">
              <Trash2Icon className="w-5 h-5" />
            </div>
          </CardTitle>

          <CardAction className="flex flex-wrap gap-3">
            {review?.badge?.map((badge, index) => (
              <Badge key={`${badge}-${index}`} variant={badge.variant}>
                {badge.label}
              </Badge>
            ))}

            <div className="flex gap-0.5 items-center">
              {Array.from({ length: 5 }).map((_, index) =>
                index < (review?.rating ?? 0) ? (
                  <StarIcon
                    className="text-amber-400 fill-amber-400 w-4 h-4"
                    key={index}
                  />
                ) : (
                  <StarIcon className="text-border w-4 h-4" key={index} />
                ),
              )}
            </div>

            <Text variant="content-1" className="text-muted-foreground">
              2026-03-10
            </Text>
          </CardAction>
        </CardHeader>

        <CardContent>
          <Text
            as="p"
            variant="heading-3"
            className="text-muted-foreground leading-normal md:leading-relaxed font-normal"
          >
            {review?.description}
          </Text>
        </CardContent>
      </Card>
    </div>
  );
}

export { ReviewDetailPage };
