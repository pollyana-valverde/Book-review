import { getCollectionsWithReviewCount } from "@/server/modules/collections/collection.queries";
import { CollectionCard } from "@/template/collections-page/components/collection-card";
import { getSession } from "@/server/auth/session";

async function CollectionList() {
  const { user } = (await getSession())!;
  const collections = await getCollectionsWithReviewCount(user.id);
  const hasCollections = collections.length > 0;

  if (!hasCollections) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold">Nenhuma coleção encontrada</h2>
        <p className="text-muted-foreground mt-2">
          Crie uma coleção para organizar suas resenhas de livros.
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
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}

export { CollectionList };
