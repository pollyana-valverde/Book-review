// Alvo de `vi.mock("@/server/modules/collections/collection.repository",
// () => import("./collection.repository.mock"))` nos testes de service —
// ver o comentário equivalente em review.repository.mock.ts.
import { fakeDb } from "@/server/test-support/fake-db-instance";
import { createFakeCollectionRepository } from "@/server/modules/collections/collection.repository.fake";

const {
  collectionWithReviewCountInclude,
  findMany,
  findManyWithReviewCount,
  findById,
  create,
  remove,
} = createFakeCollectionRepository(fakeDb);

export {
  collectionWithReviewCountInclude,
  findMany,
  findManyWithReviewCount,
  findById,
  create,
  remove,
};
