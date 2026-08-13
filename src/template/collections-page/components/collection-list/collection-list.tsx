import { getCollectionsWithReviewCount } from "@/server/modules/collections/collection.queries";
import { CollectionCard } from "@/template/collections-page/components/collection-card";
import { getSession } from "@/server/auth/session";
import { EmptyState } from "@/components/ui/empty-state";

import { FolderOpenIcon } from "lucide-react";

async function CollectionList() {
  const { user } = (await getSession())!;
  const collections = await getCollectionsWithReviewCount(user.id);
  const hasCollections = collections.length > 0;

  if (!hasCollections) {
    return (
      <EmptyState
        icon={FolderOpenIcon}
        title="Nenhuma coleção encontrada"
        description="Use o botão acima para criar sua primeira coleção e organizar suas resenhas de livros."
      />
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
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}

export { CollectionList };
