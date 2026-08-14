import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/server/modules/collections/collection.repository", () =>
  import("@/server/modules/collections/collection.repository.mock")
);
vi.mock("@/server/modules/reviews/review.repository", () =>
  import("@/server/modules/reviews/review.repository.mock")
);

import * as collectionService from "@/server/modules/collections/collection.service";
import * as collectionRepository from "@/server/modules/collections/collection.repository";
import * as reviewService from "@/server/modules/reviews/review.service";
import { resetFakeDb } from "@/server/test-support/fake-db-instance";
import { validContent } from "@/server/test-support/fixtures";
import { NotFoundError, ConflictError } from "@/server/lib/errors";

const USER_A = "user-a";
const USER_B = "user-b";

beforeEach(() => {
  resetFakeDb();
});

describe("collection.service.create", () => {
  it("rejeita título duplicado do mesmo usuário com ConflictError", async () => {
    await collectionService.create(USER_A, { title: "Ficção" });

    await expect(
      collectionService.create(USER_A, { title: "Ficção" })
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("permite o mesmo título para usuários diferentes", async () => {
    await collectionService.create(USER_A, { title: "Ficção" });

    await expect(
      collectionService.create(USER_B, { title: "Ficção" })
    ).resolves.toMatchObject({ title: "Ficção" });
  });

  it("propaga sem alterar um erro do repository que não é P2002", async () => {
    const boom = new Error("falha de conexão simulada");
    vi.spyOn(collectionRepository, "create").mockRejectedValueOnce(boom);

    await expect(
      collectionService.create(USER_A, { title: "Ficção" })
    ).rejects.toBe(boom);
  });
});

describe("collection.service.remove", () => {
  it("recusa apagar coleção com resenhas dentro (ConflictError, onDelete: Restrict)", async () => {
    const collection = await collectionService.create(USER_A, { title: "Ficção" });
    await reviewService.create(USER_A, {
      title: "Duna",
      author: "Frank Herbert",
      collectionId: collection.id,
      rating: 5,
      content: validContent(),
    });

    await expect(collectionService.remove(USER_A, collection.id)).rejects.toBeInstanceOf(
      ConflictError
    );
  });

  it("apaga coleção vazia com sucesso", async () => {
    const collection = await collectionService.create(USER_A, { title: "Ficção" });

    await expect(collectionService.remove(USER_A, collection.id)).resolves.toBeUndefined();
  });

  it("coleção de outro usuário dá NotFoundError", async () => {
    const collection = await collectionService.create(USER_A, { title: "Ficção" });

    await expect(collectionService.remove(USER_B, collection.id)).rejects.toBeInstanceOf(
      NotFoundError
    );
  });

  it("propaga sem alterar um erro do repository que não é P2003", async () => {
    const collection = await collectionService.create(USER_A, { title: "Ficção" });
    const boom = new Error("falha de conexão simulada");
    vi.spyOn(collectionRepository, "remove").mockRejectedValueOnce(boom);

    await expect(collectionService.remove(USER_A, collection.id)).rejects.toBe(boom);
  });
});

describe("collection.service.listWithReviewCount", () => {
  it("reflete o número correto de resenhas após create e delete (regressão da tarefa 0c)", async () => {
    const collection = await collectionService.create(USER_A, { title: "Ficção" });

    const beforeAny = await collectionService.listWithReviewCount(USER_A);
    expect(beforeAny.find((c) => c.id === collection.id)?.reviewsCount).toBe(0);

    const review = await reviewService.create(USER_A, {
      title: "Duna",
      author: "Frank Herbert",
      collectionId: collection.id,
      rating: 5,
      content: validContent(),
    });

    const afterCreate = await collectionService.listWithReviewCount(USER_A);
    expect(afterCreate.find((c) => c.id === collection.id)?.reviewsCount).toBe(1);

    await reviewService.remove(USER_A, review.id);

    const afterDelete = await collectionService.listWithReviewCount(USER_A);
    expect(afterDelete.find((c) => c.id === collection.id)?.reviewsCount).toBe(0);
  });
});
