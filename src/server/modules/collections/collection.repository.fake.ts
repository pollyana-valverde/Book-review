import { Prisma } from "@/generated/prisma/client";
// Import só de TIPO, de propósito: `import type` é sempre apagado na
// compilação, então isso não puxa o módulo real (que importa
// src/server/db/prisma.ts, e por tabela env.DATABASE_URL) para o runtime
// dos testes. `collectionWithReviewCountInclude` é redeclarado abaixo em
// vez de importado do módulo real pelo mesmo motivo.
import type * as CollectionRepository from "@/server/modules/collections/collection.repository";
import type { Prisma as PrismaTypes } from "@/generated/prisma/client";
import type { FakeDb } from "@/server/test-support/fake-db";

const collectionWithReviewCountInclude = {
  _count: { select: { reviews: true } },
} satisfies PrismaTypes.CollectionInclude;

/**
 * Dublê de collection.repository.ts em memória, tipado como
 * `typeof CollectionRepository` — se o repository real mudar de forma
 * (assinatura, nome de método) sem que este dublê acompanhe, o
 * TypeScript recusa a compilação (ver a falsificação da tarefa 4). Não é
 * um mock genérico: reproduz a mesma semântica do Prisma real que os
 * services dependem (unique composto userId+title -> P2002, FK Restrict
 * de Review.collection -> P2003), porque é exatamente essa semântica que
 * as regras de negócio testam.
 */
function createFakeCollectionRepository(db: FakeDb): typeof CollectionRepository {
  function withReviewCount(row: FakeDb["collections"][number]) {
    return {
      ...row,
      _count: {
        reviews: db.reviews.filter((r) => r.collectionId === row.id).length,
      },
    };
  }

  async function findMany(userId: string) {
    return db.collections
      .filter((c) => c.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async function findManyWithReviewCount(userId: string) {
    return db.collections
      .filter((c) => c.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map(withReviewCount);
  }

  async function findById(userId: string, id: string) {
    return db.collections.find((c) => c.id === id && c.userId === userId) ?? null;
  }

  async function create(data: { title: string; userId: string }) {
    const duplicate = db.collections.find(
      (c) => c.userId === data.userId && c.title === data.title
    );

    if (duplicate) {
      throw new Prisma.PrismaClientKnownRequestError(
        "Unique constraint failed on the fields: (`user_id`,`title`)",
        { code: "P2002", clientVersion: "fake" }
      );
    }

    const now = new Date();
    const row = {
      id: db.nextId("collection"),
      title: data.title,
      userId: data.userId,
      createdAt: now,
      updatedAt: now,
    };

    db.collections.push(row);
    return row;
  }

  async function remove(userId: string, id: string) {
    const index = db.collections.findIndex((c) => c.id === id && c.userId === userId);

    if (index === -1) {
      return { count: 0 };
    }

    const hasReviews = db.reviews.some((r) => r.collectionId === id);

    if (hasReviews) {
      throw new Prisma.PrismaClientKnownRequestError(
        "Foreign key constraint violated",
        { code: "P2003", clientVersion: "fake" }
      );
    }

    db.collections.splice(index, 1);
    return { count: 1 };
  }

  return {
    collectionWithReviewCountInclude,
    findMany,
    findManyWithReviewCount,
    findById,
    create,
    remove,
  };
}

export { createFakeCollectionRepository };
