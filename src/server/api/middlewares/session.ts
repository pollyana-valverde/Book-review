import "server-only";
import { createMiddleware } from "hono/factory";
import { auth } from "@/server/auth/auth";
import { UnauthorizedError } from "@/server/lib/errors";
import type { AppEnv } from "@/server/api/factory";

/**
 * Popula `user`/`session` no contexto do Hono a partir do cookie de sessão.
 * Não bloqueia nada sozinha — só busca a sessão. Aplique explicitamente nas
 * rotas que precisam saber quem está logado (ver `requireAuth` abaixo para
 * bloquear de fato). Não é global: cada rota de review/collection aplica os
 * dois via o campo `middleware` do próprio `createRoute()` (fase 6).
 */
const sessionMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);

  await next();
});

/**
 * Bloqueia a rota quando não há usuário autenticado. Precisa rodar DEPOIS
 * de `sessionMiddleware` na mesma rota. Lança UnauthorizedError, traduzido
 * pelo app.onError para 401 no formato padrão de erro da API.
 */
const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const user = c.get("user");

  if (!user) {
    throw new UnauthorizedError("É necessário estar autenticado.");
  }

  await next();
});

export { sessionMiddleware, requireAuth };
