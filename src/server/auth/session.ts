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
 * Verificação REAL de autenticação (ao contrário do middleware, que é só
 * UX). Redireciona para /sign-in com `callbackUrl` quando não há sessão.
 *
 * O middleware (src/middleware.ts) já barra a maioria das requisições sem
 * cookie antes de chegar aqui, com o `callbackUrl` correto (ele tem acesso
 * direto ao pathname da requisição). Este redirect é o backstop para o caso
 * em que o cookie existe mas a sessão não é mais válida no servidor — nesse
 * caso, sem acesso fácil ao pathname atual a partir de um layout
 * compartilhado, o redirect cai para "/sign-in" sem callbackUrl.
 */
async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

export { getSession, requireSession };
