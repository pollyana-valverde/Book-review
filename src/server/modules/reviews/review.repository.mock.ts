// Alvo de `vi.mock("@/server/modules/reviews/review.repository", () =>
// import("./review.repository.mock"))` nos testes de service — nunca
// importado pelo código de produção. Só existe para dar ao `vi.mock` um
// módulo com o shape certo (evita o problema de hoisting de fábricas
// inline referenciando variáveis externas: aqui os imports rodam
// normalmente, sem a restrição que uma factory de vi.mock teria).
import { fakeDb } from "@/server/test-support/fake-db-instance";
import { createFakeReviewRepository } from "@/server/modules/reviews/review.repository.fake";

const {
  reviewWithCollectionInclude,
  findMany,
  findRecent,
  findAll,
  findById,
  create,
  update,
  remove,
} = createFakeReviewRepository(fakeDb);

export {
  reviewWithCollectionInclude,
  findMany,
  findRecent,
  findAll,
  findById,
  create,
  update,
  remove,
};
