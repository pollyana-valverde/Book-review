import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth/auth";

/**
 * `cache()` do React: várias Server Components pedem a sessão na mesma
 * renderização (layout, navbar, página); sem isso cada uma bateria no banco.
 */
const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

/**
 * Verificação REAL de autenticação (ao contrário do proxy, que é só UX).
 * Redireciona para /sign-in com `callbackUrl` quando não há sessão.
 *
 * O proxy (src/proxy.ts) já barra a maioria das requisições sem cookie
 * antes de chegar aqui, com o `callbackUrl` correto. Este redirect é o
 * backstop para o caso em que o cookie existe mas a sessão não é mais
 * válida no servidor — o pathname vem do header `x-pathname` que o proxy
 * grava em toda requisição autenticada (um layout compartilhado não tem
 * acesso direto ao pathname atual, então não dá pra pegá-lo de outro jeito
 * aqui).
 */
async function requireSession() {
  const session = await getSession();

  if (!session) {
    const pathname = (await headers()).get("x-pathname");
    const signInUrl = pathname
      ? `/sign-in?callbackUrl=${encodeURIComponent(pathname)}`
      : "/sign-in";
    redirect(signInUrl);
  }

  return session;
}

export { getSession, requireSession };
