import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { BookOpenIcon, Trash2Icon } from "lucide-react";
import { booksReviewList } from "@/utils/book-review-list";

interface AlbumCardProps {
  album: Album;
}

function AlbumCard({ album }: AlbumCardProps) {
  const countBooksInAlbum = (albumBadge: Album["badge"]) => {
    return booksReviewList.filter((book) =>
      book.badge?.some((b) => b.variant === albumBadge)
    ).length;
  };

  const booksInThisAlbum = countBooksInAlbum(album.badge);

  return (
    <Card className="gap-2">
      <CardHeader className="gap-3">
        <CardTitle className="flex justify-between items-start gap-4 w-full">
          <Badge size="lg" variant={album.badge}>
            {album.name}
          </Badge>
          <Trash2Icon className="p-1 rounded-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:text-red-700 hover:bg-red-100" />
        </CardTitle>

        <CardDescription className="flex gap-1.5 items-center">
          <BookOpenIcon className="w-4 h-4" />
          <Text as="p" variant="content-1" className="text-muted-foreground">
            {booksInThisAlbum >= 1 && booksInThisAlbum}{" "}
            {booksInThisAlbum > 1 && "livros"}
            {booksInThisAlbum === 1 && "livro"}
            {booksInThisAlbum === 0 && "Nenhum livro"}
          </Text>
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Button asChild variant="link" className="p-0 hover:pl-2">
          <Link
            href={`/books-review?title=&&category=${encodeURIComponent(album.badge)}`}
          >
            Ver resenhas &rarr;
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export { AlbumCard };
