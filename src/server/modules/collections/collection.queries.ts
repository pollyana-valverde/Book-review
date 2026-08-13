import "server-only";
import { unstable_cache } from "next/cache";
import * as collectionService from "@/server/modules/collections/collection.service";
import { collectionsTag } from "@/server/lib/cache-tags";

// Ver o comentário equivalente em review.queries.ts sobre por que userId
// tem que estar na CHAVE, não só na tag.

function getCollections(userId: string) {
  return unstable_cache(
    () => collectionService.list(userId),
    ["collections-list", userId],
    { tags: [collectionsTag(userId)] }
  )();
}

function getCollectionsWithReviewCount(userId: string) {
  return unstable_cache(
    () => collectionService.listWithReviewCount(userId),
    ["collections-with-review-count", userId],
    { tags: [collectionsTag(userId)] }
  )();
}

export { getCollections, getCollectionsWithReviewCount };
