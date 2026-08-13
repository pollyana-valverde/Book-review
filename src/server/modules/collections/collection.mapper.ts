import "server-only";
import type { Collection } from "@/generated/prisma/client";
import type {
  CollectionDTO,
  CollectionWithReviewCountDTO,
} from "@/server/modules/collections/collection.contract";

function toCollectionDTO(collection: Pick<Collection, "id" | "title">): CollectionDTO {
  return { id: collection.id, title: collection.title };
}

function toCollectionWithReviewCountDTO(
  collection: Pick<Collection, "id" | "title"> & { _count: { reviews: number } }
): CollectionWithReviewCountDTO {
  return {
    id: collection.id,
    title: collection.title,
    reviewsCount: collection._count.reviews,
  };
}

export { toCollectionDTO, toCollectionWithReviewCountDTO };
