import Link from "next/link";
import { getAlbumBadgeColor } from "@/lib/album-badge-color";
import { ReviewDTO } from "@/template/books-review-page/types";

import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { StarIcon, Trash2Icon } from "lucide-react";

function ReviewCard({ review }: { review: ReviewDTO }) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3">
        <CardTitle className="flex justify-between items-start gap-4 w-full">
          <div className="flex flex-col">
            <Text as="h2" variant="heading-3" className="truncate">
              {review.title}
            </Text>
            <Text as="p" variant="content-1" className="text-muted-foreground">
              {review.author}
            </Text>
          </div>
          <Trash2Icon className="p-1 rounded-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:text-red-700 hover:bg-red-100" />
        </CardTitle>

        <CardAction className="flex flex-wrap gap-1">
          <Badge
            key={review.categoryId}
            style={getAlbumBadgeColor(review.categoryId)}
          >
            {review.categoryTitle}
          </Badge>
        </CardAction>

        <CardDescription className="line-clamp-2 col-span-full">
          <Text as="p" variant="content-1" className="text-muted-foreground">
            {review.description}
          </Text>
        </CardDescription>
      </CardHeader>

      <CardFooter className="grid grid-cols-2 items-center">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, index) =>
            index < review.rating ? (
              <StarIcon
                className="text-amber-400 fill-amber-400 w-5 h-5"
                key={index}
              />
            ) : (
              <StarIcon className="text-border w-5 h-5" key={index} />
            )
          )}
        </div>
        <Button asChild variant="link" className="p-0 hover:pl-2">
          <Link href={`/books-review/${review.id}`} className="text-primary">
            Read More &rarr;
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export { ReviewCard };
