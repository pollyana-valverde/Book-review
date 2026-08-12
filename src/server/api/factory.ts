import "server-only";

/**
 * Env do Hono compartilhado por toda a API.
 *
 * `Variables` está vazio por enquanto: a fase 5 (BetterAuth) adiciona o
 * usuário autenticado aqui (ex.: `Variables: { user: SessionUser }`), e a
 * fase 6 passa a usá-lo para escopar dados por dono.
 */
type AppEnv = {
  Variables: Record<string, never>;
};

export type { AppEnv };
