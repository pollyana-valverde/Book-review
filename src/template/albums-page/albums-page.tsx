import { Suspense } from "react";

import { Text } from "@/components/ui/text";
import { AlbumFormToggle } from "@/template/albums-page/components/album-form-toggle";
import { AlbumList } from "@/template/albums-page/components/album-list";
import { AlbumSkeleton } from "@/template/albums-page/components/album-skeleton";

function AlbumsContent() {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative space-y-4">
        <div>
          <Text as="h1" variant="heading-1">
            Álbuns
          </Text>
          <Text as="p" className="text-muted-foreground">
            Organize seus livros por categorias
          </Text>
        </div>

        <AlbumFormToggle />
      </div>

      <AlbumList />
    </div>
  );
}

async function AlbumsPage() {
  return (
    <Suspense fallback={<AlbumSkeleton />}>
      <AlbumsContent />
    </Suspense>
  );
}

export { AlbumsPage };
