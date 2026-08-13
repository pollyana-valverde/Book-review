import { Suspense } from "react";

import { Text } from "@/components/ui/text";
import { CollectionFormToggle } from "@/template/collections-page/components/collection-form-toggle";
import { CollectionList } from "@/template/collections-page/components/collection-list";
import { CollectionSkeleton } from "@/template/collections-page/components/collection-skeleton";

function CollectionsContent() {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative space-y-4">
        <div>
          <Text as="h1" variant="heading-1">
            Coleções
          </Text>
          <Text as="p" className="text-muted-foreground">
            Organize seus livros por coleções
          </Text>
        </div>

        <CollectionFormToggle />
      </div>

      <CollectionList />
    </div>
  );
}

async function CollectionsPage() {
  return (
    <Suspense fallback={<CollectionSkeleton />}>
      <CollectionsContent />
    </Suspense>
  );
}

export { CollectionsPage };
