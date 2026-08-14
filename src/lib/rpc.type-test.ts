/**
 * Teste de tipo do cliente RPC do Hono. Não roda em runtime e não é pego
 * por nenhum test runner (não há Vitest nesta fase, só na fase 10) — a
 * verificação é 100% estática, via `tsc` (`pnpm validate:typecheck`).
 *
 * Prova que `AppType` (src/server/api/index.ts) foi inferido corretamente.
 * Se algum `.route()` daquele arquivo virar um statement separado — a
 * armadilha (a) da fase 4 — o tipo da resposta aqui vira `any` em
 * silêncio, e `AssertNotAny` abaixo passa a falhar a compilação. É esse
 * o sinal de alarme que este arquivo existe para dar.
 *
 * Quando a fase 10 trouxer Vitest, o padrão idiomático é substituir
 * `AssertNotAny`/`IsAny` por `expectTypeOf<Body>().not.toBeAny()`.
 */
import { rpc } from "@/lib/rpc";
import type { ReviewDTO } from "@/server/modules/reviews/review.contract";
import type { CollectionDTO } from "@/server/modules/collections/collection.contract";

type IsAny<T> = 0 extends 1 & T ? true : false;

// Só compila se `T` for `false` — ou seja, só compila se o tipo testado
// NÃO for `any`.
type AssertNotAny<T extends false> = T;

async function typeTestReviewsList() {
  const res = await rpc.api.reviews.$get({ query: {} });
  type Body = Awaited<ReturnType<typeof res.json>>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- só existe para o tsc avaliar
  type _ReviewsListResponseIsNotAny = AssertNotAny<IsAny<Body>>;

  if (!res.ok) {
    return null;
  }

  const body = await res.json();
  const items: ReviewDTO[] = body.items;
  const nextCursor: string | null = body.nextCursor;

  return { items, nextCursor };
}

async function typeTestCollectionsList() {
  const res = await rpc.api.collections.$get();
  type Body = Awaited<ReturnType<typeof res.json>>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- só existe para o tsc avaliar
  type _CollectionsListResponseIsNotAny = AssertNotAny<IsAny<Body>>;

  if (!res.ok) {
    return null;
  }

  const collections: CollectionDTO[] = await res.json();

  return collections;
}

export { typeTestReviewsList, typeTestCollectionsList };
