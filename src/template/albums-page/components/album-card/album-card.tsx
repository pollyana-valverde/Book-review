import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAlbumBadgeColor } from "@/lib/album-badge-color";

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

interface AlbumCardProps {
  album: Album;
}

async function AlbumCard({ album }: AlbumCardProps) {
  const bookReviews = await prisma.review.findMany();

  const countBooksInAlbum = (albumId: Album["id"]) => {
    return bookReviews.filter((book) => book.categoryId?.includes(albumId))
      .length;
  };

  const booksInThisAlbum = countBooksInAlbum(album.id);

  return (
    <Card className="gap-2">
      <CardHeader className="gap-3">
        <CardTitle className="flex justify-between items-start gap-4 w-full">
          <Badge style={getAlbumBadgeColor(album.id || album.title)} size="lg">
            {album.title}
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
            href={`/books-review?title=&&category=${encodeURIComponent(album.id)}`}
          >
            Ver resenhas &rarr;
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export { AlbumCard };
