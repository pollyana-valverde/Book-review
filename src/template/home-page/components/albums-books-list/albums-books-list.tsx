import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

import { albumsList, booksReviewList } from "@/utils";

function AlbumsBooksList() {
  const hasAlbums = albumsList.length > 0;

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

  const countBooksInAlbum = (albumBadge: Album["badge"]) => {
    return booksReviewList.filter((book) =>
      book.badge?.some((b) => b.variant === albumBadge)
    ).length;
  };

  return (
    <Card className="p-0 gap-0 md:p-0">
      {albumsList.map((album) => {
        const booksInThisAlbum = countBooksInAlbum(album.badge);

        return (
          <div
            key={album.badge}
            className="p-4 flex justify-between items-center not-first:border-t"
          >
            <Badge variant={album.badge}>{album.name}</Badge>
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
