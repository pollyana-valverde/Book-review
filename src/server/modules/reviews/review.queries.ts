import "server-only";
import { unstable_cache } from "next/cache";
import * as reviewService from "@/server/modules/reviews/review.service";
import { reviewsTag, reviewTag } from "@/server/lib/cache-tags";

/**
 * `userId` entra tanto na CHAVE (`keyParts`, o segundo argumento de
 * `unstable_cache`) quanto na TAG. Só a tag não bastaria: o cache é
 * compartilhado entre requisições de usuários diferentes, então sem
 * `userId` na chave o primeiro usuário a carregar a página popularia a
 * entrada de cache que os outros iriam ler — vazamento de dados entre
 * contas. Por isso cada leitura aqui embrulha `unstable_cache` dentro de
 * uma função chamada com `userId` já em mãos, em vez de um wrapper único
 * criado uma vez no carregamento do módulo.
 */

function getReviews(
  userId: string,
  query: Parameters<typeof reviewService.list>[1]
) {
  return unstable_cache(
    () => reviewService.list(userId, query),
    ["reviews-list", userId, JSON.stringify(query)],
    { tags: [reviewsTag(userId)] }
  )();
}

function getRecentReviews(userId: string, limit: number) {
  return unstable_cache(
    () => reviewService.listRecent(userId, limit),
    ["reviews-recent", userId, String(limit)],
    { tags: [reviewsTag(userId)] }
  )();
}

function getAllReviews(userId: string) {
  return unstable_cache(
    () => reviewService.getAll(userId),
    ["reviews-all", userId],
    { tags: [reviewsTag(userId)] }
  )();
}

function getReviewById(userId: string, id: string) {
  return unstable_cache(
    () => reviewService.getById(userId, id),
    ["review-by-id", userId, id],
    { tags: [reviewsTag(userId), reviewTag(userId, id)] }
  )();
}

export { getReviews, getRecentReviews, getAllReviews, getReviewById };
