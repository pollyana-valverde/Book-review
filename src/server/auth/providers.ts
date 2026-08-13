import "server-only";
import { env } from "@/lib/env";

/**
 * Um provedor social só é considerado configurado quando SEU PAR completo
 * (id + secret) existe. Um botão que leva a um provedor mal configurado é
 * pior do que nenhum botão — por isso a UI (ver
 * src/features/auth/components/social-buttons.tsx) usa isto para decidir o
 * que mostrar, e src/server/auth/auth.ts usa isto para decidir o que
 * registrar no BetterAuth.
 */
function isGoogleConfigured() {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}

function isGithubConfigured() {
  return Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET);
}

function getEnabledSocialProviders() {
  return {
    google: isGoogleConfigured(),
    github: isGithubConfigured(),
  };
}

export { isGoogleConfigured, isGithubConfigured, getEnabledSocialProviders };
