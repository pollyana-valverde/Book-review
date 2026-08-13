import "server-only";

/**
 * Tags de cache (`unstable_cache` / `revalidateTag`) para os dados de
 * reviews e albums — por USUÁRIO desde a fase 6 (ownership). Uma tag sem
 * `userId` faz o cache de um usuário vazar para outro: quem carrega a
 * página primeiro popularia a entrada que todo mundo depois leria. Por
 * isso `userId` é obrigatório aqui, não opcional.
 */
function reviewsTag(userId: string) {
  return `reviews:${userId}`;
}

function reviewTag(userId: string, id: string) {
  return `review:${userId}:${id}`;
}

function albumsTag(userId: string) {
  return `albums:${userId}`;
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
