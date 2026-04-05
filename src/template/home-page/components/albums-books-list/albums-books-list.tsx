import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

const albumsCount: Album[] = [
  {
    name: "Fantasia",
    booksCount: 2,
    badge: "fantasy",
  },
  {
    name: "Ficção",
    booksCount: 2,
    badge: "fiction",
  },
  {
    name: "Romance",
    booksCount: 2,
    badge: "romance",
  },
  {
    name: "Não-ficção",
    booksCount: 2,
    badge: "non-fiction",
  },
  {
    name: "Ficção científica",
    booksCount: 2,
    badge: "sci-fi",
  },
];

function AlbumsBooksList() {
  return (
    <Card className="p-0 gap-0">
      {albumsCount.map((album) => (
        <div
          key={album.badge}
          className="p-4 flex justify-between items-center not-first:border-t"
        >
          <Badge variant={album.badge}>{album.name}</Badge>
          <Text as="p" variant="content-1" className="text-muted-foreground">
            {album.booksCount} livros
          </Text>
        </div>
      ))}
    </Card>
  );
}

export { AlbumsBooksList };
