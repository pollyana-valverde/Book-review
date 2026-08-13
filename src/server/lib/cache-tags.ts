import "server-only";

/**
 * Tags de cache (`unstable_cache` / `revalidateTag`) para os dados de
 * reviews e albums. Ainda não são por usuário — a fase 6 (ownership) deve
 * receber um `userId` aqui como prefixo (ex.: `${userId}:reviews`) em vez de
 * inventar esse conceito agora.
 */
function reviewsTag() {
  return "reviews";
}

function reviewTag(id: string) {
  return `review:${id}`;
}

function albumsTag() {
  return "albums";
}

/**
 * Perfil de revalidação usado em todo `revalidateTag(tag, REVALIDATE_NOW)`.
 *
 * Confirmado contra `next@16.3.0` (node_modules/next/dist/server/web/
 * spec-extension/revalidate.d.ts): `revalidateTag(tag: string, profile:
 * string | { expire?: number }): undefined`. O JSDoc do próprio pacote diz
 * "For immediate expiration in Server Actions, use updateTag instead" — ou
 * seja, para expiração imediata FORA de Server Actions (nosso caso: rotas
 * Hono rodando como Route Handler), `{ expire: 0 }` é o uso previsto.
 *
 * O perfil "recomendado" pela doc pública (`"max"`) dá stale-while-revalidate:
 * a página seguinte ainda mostraria dado velho e só atualizaria em segundo
 * plano. Isso quebraria o critério "a lista atualiza sem reload manual" após
 * criar/editar/remover, e mudaria o comportamento que já existia com
 * `revalidatePath` (sempre imediato). `{ expire: 0 }` reproduz esse
 * imediatismo.
 */
const REVALIDATE_NOW = { expire: 0 } as const;

export { reviewsTag, reviewTag, albumsTag, REVALIDATE_NOW };
