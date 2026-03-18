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

import { StarIcon } from "lucide-react";

const books: Book[] = [
  {
    title: "Book Title 1",
    author: "Author 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    badge: [{ label: "Fantasia", variant: "default" }],
    rating: 4,
  },
  {
    title: "Book Title 1",
    author: "Author 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    badge: [{ label: "Fantasia", variant: "default" }],
    rating: 4,
  },
  {
    title: "Book Title 1",
    author: "Author 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    badge: [{ label: "Fantasia", variant: "default" }],
    rating: 4,
  },
  {
    title: "Book Title 1",
    author: "Author 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    badge: [{ label: "Fantasia", variant: "default" }],
    rating: 4,
  },
];

function BooksCards() {
  return (
    <div
      className={`grid 
    sm:grid-cols-2 
    lg:grid-cols-3 
    xl:grid-cols-4 gap-3`}
    >
      {books.map((book, index) => (
        <Card key={`${book}-${index}`}>
          <CardHeader className="flex flex-col gap-3">
            <CardTitle className="flex flex-col w-full">
              <Text as="h2" variant="heading-3" className="truncate">
                {book.title}
              </Text>
              <Text
                as="p"
                variant="content-1"
                className="text-muted-foreground"
              >
                {book.author}
              </Text>
            </CardTitle>

            <CardAction className="flex flex-wrap gap-1">
              {book.badge?.map((badge, index) => (
                <Badge key={`${badge}-${index}`} variant={badge.variant}>
                  {badge.label}
                </Badge>
              ))}
            </CardAction>

            <CardDescription className="line-clamp-2 col-span-full">
              <Text
                as="p"
                variant="content-1"
                className="text-muted-foreground"
              >
                {book.description}
              </Text>
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <div className="flex gap-0.5 flex-1">
              {Array.from({ length: 5 }).map((_, index) =>
                index < book.rating ? (
                  <StarIcon className="text-amber-400 w-5 h-5" key={index} />
                ) : (
                  <StarIcon className="text-border w-5 h-5" key={index} />
                ),
              )}
            </div>
            <Button asChild variant="link" className="flex-1 p-0 hover:pl-2">
              <Text>Read More &rarr;</Text>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export { BooksCards };
