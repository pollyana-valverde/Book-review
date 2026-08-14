import type { Prisma } from "@/generated/prisma/client";

/**
 * "Banco" em memória compartilhado pelos dublês de review.repository e
 * collection.repository — não é um banco de verdade, não toca o
 * Postgres. Compartilhado (não um por módulo) de propósito: a restrição
 * de foreign key (`onDelete: Restrict` em Review.collection) e a
 * contagem de resenhas por coleção atravessam as duas entidades, exatamente
 * como no Postgres real.
 */

interface FakeCollectionRow {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FakeReviewRow {
  id: string;
  title: string;
  author: string;
  collectionId: string;
  rating: number;
  // Prisma.JsonValue (o tipo de LEITURA), não Prisma.InputJsonValue (o de
  // escrita) — os dois não são intercambiáveis (InputJsonObject não é um
  // JsonValue válido, faltam os métodos de array). O repository real lê
  // Review.content como JsonValue; guardar como InputJsonValue aqui já
  // quebrou a tipagem do dublê contra `typeof ReviewRepository` (pego
  // pela checagem de tipos, exatamente o que a tarefa 4 pede para provar).
  content: Prisma.JsonValue;
  contentText: string;
  excerpt: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

function createFakeDb() {
  const collections: FakeCollectionRow[] = [];
  const reviews: FakeReviewRow[] = [];
  let idCounter = 0;

  function nextId(prefix: string) {
    idCounter += 1;
    return `${prefix}-${idCounter}`;
  }

  return { collections, reviews, nextId };
}

type FakeDb = ReturnType<typeof createFakeDb>;

export { createFakeDb };
export type { FakeDb, FakeCollectionRow, FakeReviewRow };
