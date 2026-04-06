import { Text } from "@/components/ui/text";
import { AlbumList } from "./componentes";

function AlbumsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Text as="h1" variant="heading-1">
          Álbuns
        </Text>
        <Text as="p" className="text-muted-foreground">
          Organize seus livros por categorias
        </Text>
      </div>
      <AlbumList />
    </div>
  );
}

export { AlbumsPage };
