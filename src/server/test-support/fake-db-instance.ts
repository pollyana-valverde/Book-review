import { createFakeDb } from "@/server/test-support/fake-db";

/**
 * Instância única do banco em memória, compartilhada entre
 * review.repository.mock.ts e collection.repository.mock.ts (os dois
 * módulos que `vi.mock` substitui nos testes de service) — assim uma
 * resenha criada num teste é visível pelo lado da coleção, igual ao
 * Postgres real. Isolada por ARQUIVO de teste (Vitest reseta o registro
 * de módulos por arquivo), mas ainda assim precisa de `resetFakeDb()` num
 * `beforeEach` para isolar teste a teste dentro do mesmo arquivo.
 */
const fakeDb = createFakeDb();

function resetFakeDb() {
  fakeDb.collections.length = 0;
  fakeDb.reviews.length = 0;
}

export { fakeDb, resetFakeDb };
