import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { Text } from "../ui/text";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const books: Book[] = [
  {
    title: "Book Title 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    badge: [
      { label: "Featured", variant: "secondary" },
      { label: "New", variant: "default" },
    ],
  },
];

function BooksCards() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {books.map((book, index) => (
        <Card key={`${book}-${index}`}>
          <CardHeader>
            <CardTitle>
              <Text as="h2" variant="heading-3">
                {book.title}
              </Text>
            </CardTitle>
            <CardDescription className="line-clamp-2 col-span-full">
              <Text as="p" variant="content-1">
                {book.description}
              </Text>
            </CardDescription>
            <CardAction className="flex flex-wrap gap-1">
              {book.badge?.map((badge, index) => (
                <Badge key={`${badge}-${index}`} variant={badge.variant}>
                  {badge.label}
                </Badge>
              ))}
            </CardAction>
          </CardHeader>

          <CardFooter>
            <Button asChild variant="link" className="pl-0 hover:pl-1">
              <Text>
                Read More &rarr;
              </Text>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export { BooksCards };
