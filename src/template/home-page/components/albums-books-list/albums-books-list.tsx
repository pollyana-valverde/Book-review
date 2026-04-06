import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

import { albumsList } from "@/utils";

function AlbumsBooksList() {
  
  return (
    <Card className="p-0 gap-0">
      {albumsList.map((album) => (
        <div
          key={album.badge}
          className="p-4 flex justify-between items-center not-first:border-t"
        >
          <Badge variant={album.badge}>{album.name}</Badge>
          <Text as="p" variant="content-1" className="text-muted-foreground">
            {album.booksCount} {album.booksCount > 1 ? "livros" : "livro"}
          </Text>
        </div>
      ))}
    </Card>
  );
}

export { AlbumsBooksList };
