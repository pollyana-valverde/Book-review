import { getCollectionsWithReviewCount } from "@/server/modules/collections/collection.queries";
import { getCollectionBadgeColor } from "@/lib/collection-badge-color";
import { getSession } from "@/server/auth/session";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

async function CollectionsBooksList() {
  const { user } = (await getSession())!;
  const collections = await getCollectionsWithReviewCount(user.id);

  const hasCollections = collections.length > 0;

  if (!hasCollections) {
    return (
      <div className="py-10">
        <h2 className="text-2xl font-semibold">Nenhuma coleção encontrada</h2>
        <p className="text-muted-foreground mt-2">
          Crie uma coleção para organizar suas resenhas de livros.
        </p>
      </div>
    );
  }

  return (
    <Card className="p-0 gap-0 md:p-0">
      {collections.map((collection) => {
        const booksInThisCollection = collection.reviewsCount;

        return (
          <div
            key={collection.id}
            className="p-4 flex justify-between items-center not-first:border-t"
          >
            <Badge style={getCollectionBadgeColor(collection.id || collection.title)}>
              {collection.title}
            </Badge>
            <Text as="p" variant="content-1" className="text-muted-foreground">
              {booksInThisCollection >= 1 && booksInThisCollection}{" "}
              {booksInThisCollection > 1 && "livros"}
              {booksInThisCollection === 1 && "livro"}
              {booksInThisCollection === 0 && "Nenhum livro"}
            </Text>
          </div>
        );
      })}
    </Card>
  );
}

export { CollectionsBooksList };
