import { fetchAlbumsWithBookCount } from "@/api/services/album-services";
import { getAlbumBadgeColor } from "@/lib/album-badge-color";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

async function AlbumsBooksList() {
  const albums = await fetchAlbumsWithBookCount();

  const hasAlbums = albums.length > 0;

  if (!hasAlbums) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold">Nenhum álbum encontrado</h2>
        <p className="text-muted-foreground mt-2">
          Crie um álbum para organizar suas resenhas de livros.
        </p>
      </div>
    );
  }

  return (
    <Card className="p-0 gap-0 md:p-0">
      {albums.map((album) => {
        const booksInThisAlbum = album._count.reviews;

        return (
          <div
            key={album.id}
            className="p-4 flex justify-between items-center not-first:border-t"
          >
            <Badge style={getAlbumBadgeColor(album.id || album.title)}>
              {album.title}
            </Badge>
            <Text as="p" variant="content-1" className="text-muted-foreground">
              {booksInThisAlbum >= 1 && booksInThisAlbum}{" "}
              {booksInThisAlbum > 1 && "livros"}
              {booksInThisAlbum === 1 && "livro"}
              {booksInThisAlbum === 0 && "Nenhum livro"}
            </Text>
          </div>
        );
      })}
    </Card>
  );
}

export { AlbumsBooksList };
