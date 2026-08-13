import { Prisma } from "@/generated/prisma/client";
// Import só de TIPO — ver o comentário equivalente em
// collection.repository.fake.ts sobre por que o valor não é importado do
// módulo real (puxaria src/server/db/prisma.ts para o runtime dos testes).
import type * as ReviewRepository from "@/server/modules/reviews/review.repository";
import type { Prisma as PrismaTypes } from "@/generated/prisma/client";
import type { FakeDb } from "@/server/test-support/fake-db";

const reviewWithCollectionInclude = {
  collection: { select: { title: true } },
} satisfies PrismaTypes.ReviewInclude;

/**
 * Dublê de review.repository.ts em memória, tipado como
 * `typeof ReviewRepository` — mesma ideia de collection.repository.fake.ts.
 * Reproduz cursor pagination (`take: limit + 1`), a busca por título OU
 * contentText, e o unique composto userId+title (-> P2002), porque são
 * exatamente essas regras que review.service depende para funcionar.
 */
function createFakeReviewRepository(db: FakeDb): typeof ReviewRepository {
  function withCollection(row: FakeDb["reviews"][number]) {
    const collection = db.collections.find((c) => c.id === row.collectionId);
    return { ...row, collection: { title: collection?.title ?? "" } };
  }

  async function findMany(params: {
    userId: string;
    title?: string;
    collectionId?: string;
    cursor?: string;
    limit: number;
  }) {
    const { userId, title, collectionId, cursor, limit } = params;

    let results = db.reviews.filter((r) => r.userId === userId);

    if (collectionId) {
      results = results.filter((r) => r.collectionId === collectionId);
    }

    if (title) {
      const needle = title.toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(needle) ||
          r.contentText.toLowerCase().includes(needle)
      );
    }

    results = [...results].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    if (cursor) {
      const index = results.findIndex((r) => r.id === cursor);
      results = index >= 0 ? results.slice(index + 1) : results;
    }

    return results.slice(0, limit + 1).map(withCollection);
  }

  async function findRecent(userId: string, limit: number) {
    return db.reviews
      .filter((r) => r.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit)
      .map(withCollection);
  }

  async function findAll(userId: string) {
    return db.reviews.filter((r) => r.userId === userId);
  }

  async function findById(userId: string, id: string) {
    const row = db.reviews.find((r) => r.id === id && r.userId === userId);
    return row ? withCollection(row) : null;
  }

  function assertNoDuplicateTitle(userId: string, title: string, excludeId?: string) {
    const duplicate = db.reviews.find(
      (r) => r.userId === userId && r.title === title && r.id !== excludeId
    );

    if (duplicate) {
      throw new Prisma.PrismaClientKnownRequestError(
        "Unique constraint failed on the fields: (`user_id`,`title`)",
        { code: "P2002", clientVersion: "fake" }
      );
    }
  }

  async function create(data: {
    title: string;
    author: string;
    collectionId: string;
    rating: number;
    content: Prisma.InputJsonValue;
    contentText: string;
    excerpt: string;
    userId: string;
  }) {
    assertNoDuplicateTitle(data.userId, data.title);

    const now = new Date();
    // Mesma distinção InputJsonValue (escrita) vs JsonValue (leitura) do
    // Prisma real — ver o comentário em fake-db.ts.
    const row: FakeDb["reviews"][number] = {
      ...data,
      content: data.content as Prisma.JsonValue,
      id: db.nextId("review"),
      createdAt: now,
      updatedAt: now,
    };

    db.reviews.push(row);
    return withCollection(row);
  }

  async function update(
    userId: string,
    id: string,
    data: Partial<{
      title: string;
      author: string;
      collectionId: string;
      rating: number;
      content: Prisma.InputJsonValue;
      contentText: string;
      excerpt: string;
    }>
  ) {
    const row = db.reviews.find((r) => r.id === id && r.userId === userId);

    if (!row) {
      return { count: 0 };
    }

    if (data.title) {
      assertNoDuplicateTitle(userId, data.title, id);
    }

    Object.assign(row, data, { updatedAt: new Date() });
    return { count: 1 };
  }

  async function remove(userId: string, id: string) {
    const index = db.reviews.findIndex((r) => r.id === id && r.userId === userId);

    if (index === -1) {
      return { count: 0 };
    }

    db.reviews.splice(index, 1);
    return { count: 1 };
  }

  return {
    reviewWithCollectionInclude,
    findMany,
    findRecent,
    findAll,
    findById,
    create,
    update,
    remove,
  };
}

export { createFakeReviewRepository };
