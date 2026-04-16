import { prisma } from "@/lib/prisma";

import { AlbumCard } from "@/template/albums-page/components/album-card";

async function AlbumList() {
  const albums = await prisma.album.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });
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
    <div
      className={`grid 
        sm:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4 gap-3
       `}
    >
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}

export { AlbumList };
