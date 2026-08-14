import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

function setOrDeleteParam(
  searchParams: URLSearchParams,
  key: string,
  value?: string | string[]
) {
  if (value === undefined || value === "all") {
    searchParams.delete(key);
  } else {
    searchParams.set(key, value.toString());
  }
}

/**
 * `replace`, não `push`: filtro de busca não deveria empilhar uma entrada
 * de histórico por tecla/seleção — `scroll: false` porque trocar o filtro
 * não deve rolar a página de volta pro topo.
 */
function replaceWithParams(
  router: AppRouterInstance,
  pathname: string,
  searchParams: URLSearchParams
) {
  const queryString = searchParams.toString();
  router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
    scroll: false,
  });
}

export { setOrDeleteParam, replaceWithParams };
