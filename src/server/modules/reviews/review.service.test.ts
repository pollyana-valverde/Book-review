import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/server/modules/reviews/review.repository", () =>
  import("@/server/modules/reviews/review.repository.mock")
);
vi.mock("@/server/modules/collections/collection.repository", () =>
  import("@/server/modules/collections/collection.repository.mock")
);

import * as reviewService from "@/server/modules/reviews/review.service";
import * as collectionService from "@/server/modules/collections/collection.service";
import { fakeDb, resetFakeDb } from "@/server/test-support/fake-db-instance";
import { validContent } from "@/server/test-support/fixtures";
import { NotFoundError, ConflictError, ValidationError } from "@/server/lib/errors";

const USER_A = "user-a";
const USER_B = "user-b";

async function seedCollection(userId: string, title = "Ficção") {
  return collectionService.create(userId, { title });
}

beforeEach(() => {
  resetFakeDb();
});

describe("review.service.create", () => {
  it("rejeita coleção que não pertence ao usuário com NotFoundError", async () => {
    const collectionOfB = await seedCollection(USER_B);

    await expect(
      reviewService.create(USER_A, {
        title: "Duna",
        author: "Frank Herbert",
        collectionId: collectionOfB.id,
        rating: 5,
        content: validContent(),
      })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("rejeita título duplicado do mesmo usuário com ConflictError (P2002)", async () => {
    const collection = await seedCollection(USER_A);
    const data = {
      title: "Duna",
      author: "Frank Herbert",
      collectionId: collection.id,
      rating: 5,
      content: validContent(),
    };

    await reviewService.create(USER_A, data);

    await expect(reviewService.create(USER_A, data)).rejects.toBeInstanceOf(
      ConflictError
    );
  });

  it("permite o mesmo título para usuários diferentes (unique composto por userId, fase 6)", async () => {
    const collectionA = await seedCollection(USER_A);
    const collectionB = await seedCollection(USER_B);

    await reviewService.create(USER_A, {
      title: "Duna",
      author: "Frank Herbert",
      collectionId: collectionA.id,
      rating: 5,
      content: validContent(),
    });

    await expect(
      reviewService.create(USER_B, {
        title: "Duna",
        author: "Frank Herbert",
        collectionId: collectionB.id,
        rating: 4,
        content: validContent(),
      })
    ).resolves.toMatchObject({ title: "Duna" });
  });

  it("sanitiza o conteúdo e deriva contentText/excerpt", async () => {
    const collection = await seedCollection(USER_A);

    const review = await reviewService.create(USER_A, {
      title: "Duna",
      author: "Frank Herbert",
      collectionId: collection.id,
      rating: 5,
      content: validContent("Um clássico da ficção científica"),
    });

    expect(review.excerpt).toBe("Um clássico da ficção científica");

    const stored = fakeDb.reviews.find((r) => r.id === review.id);
    expect(stored?.contentText).toBe("Um clássico da ficção científica");
  });

  it("rejeita nó fora da lista de extensões com ValidationError", async () => {
    const collection = await seedCollection(USER_A);

    await expect(
      reviewService.create(USER_A, {
        title: "Duna",
        author: "Frank Herbert",
        collectionId: collection.id,
        rating: 5,
        content: { type: "doc", content: [{ type: "script" }] },
      })
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("rejeita conteúdo acima do limite de tamanho com ValidationError", async () => {
    const collection = await seedCollection(USER_A);
    const bigText = "a".repeat(200_000);

    await expect(
      reviewService.create(USER_A, {
        title: "Duna",
        author: "Frank Herbert",
        collectionId: collection.id,
        rating: 5,
        content: validContent(bigText),
      })
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

describe("review.service.update", () => {
  it("não corrompe o conteúdo existente quando content não é enviado", async () => {
    const collection = await seedCollection(USER_A);
    const created = await reviewService.create(USER_A, {
      title: "Duna",
      author: "Frank Herbert",
      collectionId: collection.id,
      rating: 5,
      content: validContent("texto original"),
    });

    const updated = await reviewService.update(USER_A, created.id, { rating: 3 });

    expect(updated.rating).toBe(3);
    expect(updated.excerpt).toBe("texto original");

    const stored = fakeDb.reviews.find((r) => r.id === created.id);
    expect(stored?.contentText).toBe("texto original");
  });
});

describe("review.service.getById", () => {
  it("resenha de outro usuário dá NotFoundError, não vazamento", async () => {
    const collection = await seedCollection(USER_A);
    const created = await reviewService.create(USER_A, {
      title: "Duna",
      author: "Frank Herbert",
      collectionId: collection.id,
      rating: 5,
      content: validContent(),
    });

    await expect(reviewService.getById(USER_B, created.id)).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});

describe("review.service.remove", () => {
  it("resenha de outro usuário dá NotFoundError e o registro sobrevive", async () => {
    const collection = await seedCollection(USER_A);
    const created = await reviewService.create(USER_A, {
      title: "Duna",
      author: "Frank Herbert",
      collectionId: collection.id,
      rating: 5,
      content: validContent(),
    });

    await expect(reviewService.remove(USER_B, created.id)).rejects.toBeInstanceOf(
      NotFoundError
    );

    expect(fakeDb.reviews.some((r) => r.id === created.id)).toBe(true);
  });
});

describe("review.service.list", () => {
  it("devolve nextCursor quando há mais páginas, e null no fim", async () => {
    const collection = await seedCollection(USER_A);

    for (let i = 0; i < 5; i++) {
      await reviewService.create(USER_A, {
        title: `Livro ${i}`,
        author: "Autor",
        collectionId: collection.id,
        rating: 3,
        content: validContent(),
      });
    }

    const firstPage = await reviewService.list(USER_A, { limit: 2 });
    expect(firstPage.items).toHaveLength(2);
    expect(firstPage.nextCursor).not.toBeNull();

    const secondPage = await reviewService.list(USER_A, {
      limit: 2,
      cursor: firstPage.nextCursor!,
    });
    expect(secondPage.items).toHaveLength(2);
    expect(secondPage.nextCursor).not.toBeNull();

    const thirdPage = await reviewService.list(USER_A, {
      limit: 2,
      cursor: secondPage.nextCursor!,
    });
    expect(thirdPage.items).toHaveLength(1);
    expect(thirdPage.nextCursor).toBeNull();
  });

  it('normaliza collectionId === "all" para undefined (não filtra)', async () => {
    const collectionA = await seedCollection(USER_A, "Ficção");
    const collectionB = await seedCollection(USER_A, "Não ficção");

    await reviewService.create(USER_A, {
      title: "Livro 1",
      author: "Autor",
      collectionId: collectionA.id,
      rating: 3,
      content: validContent(),
    });
    await reviewService.create(USER_A, {
      title: "Livro 2",
      author: "Autor",
      collectionId: collectionB.id,
      rating: 3,
      content: validContent(),
    });

    const result = await reviewService.list(USER_A, { collectionId: "all" });
    expect(result.items).toHaveLength(2);
  });
});
