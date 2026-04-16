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

function pushWithParams(
  router: AppRouterInstance,
  pathname: string,
  searchParams: URLSearchParams
) {
  const queryString = searchParams.toString();
  router.push(queryString ? `${pathname}?${queryString}` : pathname);
}

export { setOrDeleteParam, pushWithParams };
