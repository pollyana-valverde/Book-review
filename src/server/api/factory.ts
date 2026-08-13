import "server-only";
import type { auth } from "@/server/auth/auth";

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

/**
 * Env do Hono compartilhado por toda a API.
 *
 * `user`/`session` são preenchidos por
 * `src/server/api/middlewares/session.ts` e ficam `null` quando não há
 * sessão — o middleware roda por rota (não é global), então uma rota que
 * não o aplica só tem `Variables` no tipo, nunca no runtime. A fase 6 passa
 * a usar `user.id` para escopar dados por dono nas rotas de review/album.
 */
type AppEnv = {
  Variables: {
    user: Session["user"] | null;
    session: Session["session"] | null;
  };
};

export type { AppEnv };
