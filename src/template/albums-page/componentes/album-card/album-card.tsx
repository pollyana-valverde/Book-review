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

import { BookOpenIcon } from "lucide-react";

interface AlbumCardProps {
  album: Album;
}

function AlbumCard({ album }: AlbumCardProps) {
  const booksPlural = album.booksCount > 1 ? "livros" : "livro";

  return (
    <Card className="gap-2">
      <CardHeader className="gap-3">
        <CardTitle>
          <Badge size="lg" variant={album.badge}>
            {album.name}
          </Badge>
        </CardTitle>

        <CardDescription className="flex gap-1.5 items-center">
          <BookOpenIcon className="w-4 h-4" />
          <Text as="p" variant="content-1" className="text-muted-foreground">
            {album.booksCount} {booksPlural}
          </Text>
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Button asChild variant="link" className="p-0 hover:pl-2">
          <Text>Ver resenhas &rarr;</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}

export { AlbumCard };
