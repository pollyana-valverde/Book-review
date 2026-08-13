import "server-only";

/**
 * Tags de cache (`unstable_cache` / `revalidateTag`) para os dados de
 * reviews e collections — por USUÁRIO desde a fase 6 (ownership). Uma tag
 * sem `userId` faz o cache de um usuário vazar para outro: quem carrega a
 * página primeiro popularia a entrada que todo mundo depois leria. Por
 * isso `userId` é obrigatório aqui, não opcional.
 */
function reviewsTag(userId: string) {
  return `reviews:${userId}`;
}

function reviewTag(userId: string, id: string) {
  return `review:${userId}:${id}`;
}

function collectionsTag(userId: string) {
  return `collections:${userId}`;
}

/**
 * Todas as tags que uma mutação de review (create/update/delete) precisa
 * invalidar — centralizado aqui de propósito, e não listado à mão em cada
 * rota/action. `collection.service.listWithReviewCount` lê `reviewsCount`
 * através da relação Collection -> Review; isso faz `collectionsTag(userId)`
 * depender de dados de review, mesmo a leitura estando cacheada sob a tag
 * de collection. Essa dependência cruzada ficou de fora quando trocamos
 * `revalidatePath` por `revalidateTag` na fase 4 — o sintoma foi contagem
 * de livros por coleção ficando presa em "Nenhum livro" depois de criar
 * uma resenha, corrigido só ao reiniciar o servidor (fase 10, tarefa 0c).
 * Uma rota que precisasse lembrar de invalidar `collectionsTag` sozinha
 * ia esquecer de novo — daqui pra frente, todo mutador de review chama
 * esta função, não `revalidateTag` tag por tag.
 */
function tagsForReviewMutation(userId: string, reviewId?: string): string[] {
  const tags = [reviewsTag(userId), collectionsTag(userId)];

  if (reviewId) {
    tags.push(reviewTag(userId, reviewId));
  }

  return tags;
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

export {
  reviewsTag,
  reviewTag,
  collectionsTag,
  tagsForReviewMutation,
  REVALIDATE_NOW,
};
