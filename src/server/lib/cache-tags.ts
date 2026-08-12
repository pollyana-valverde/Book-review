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
 * O Next 16 exige um segundo argumento em `revalidateTag`. O padrão
 * recomendado (`"max"`) dá stale-while-revalidate: a página seguinte ainda
 * mostraria dado velho e só atualizaria em segundo plano. Isso quebraria o
 * critério "a lista atualiza sem reload manual" após criar/editar/remover —
 * e mudaria o comportamento que já existia com `revalidatePath` (sempre
 * imediato). `{ expire: 0 }` reproduz esse imediatismo.
 */
const REVALIDATE_NOW = { expire: 0 } as const;

export { reviewsTag, reviewTag, albumsTag, REVALIDATE_NOW };
