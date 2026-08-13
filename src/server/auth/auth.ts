import "server-only";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/server/db/prisma";
import { env } from "@/lib/env";
import { isGoogleConfigured, isGithubConfigured } from "@/server/auth/providers";

const socialProviders: NonNullable<
  Parameters<typeof betterAuth>[0]["socialProviders"]
> = {};

if (isGoogleConfigured()) {
  socialProviders.google = {
    clientId: env.GOOGLE_CLIENT_ID!,
    clientSecret: env.GOOGLE_CLIENT_SECRET!,
  };
}

if (isGithubConfigured()) {
  socialProviders.github = {
    clientId: env.GITHUB_CLIENT_ID!,
    clientSecret: env.GITHUB_CLIENT_SECRET!,
  };
}

const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL ?? env.NEXT_PUBLIC_APP_URL,
  secret: env.BETTER_AUTH_SECRET,
  // Precisa bater EXATAMENTE com onde o handler é montado no Hono
  // (app.basePath("/api") + rota "/auth/*" em src/server/api/index.ts).
  basePath: "/api/auth",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
    // Sem sendResetPassword de propósito: reset de senha está fora do
    // escopo desta fase (decisão registrada em docs/refactor-plan.md).
    // requireEmailVerification também não é setado — verificação de e-mail
    // foi removida do plano.
  },
  socialProviders,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // 1 dia
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutos
    },
  },
  rateLimit: {
    // Nativo do BetterAuth. Por padrão só liga em produção; forçamos aqui
    // para cobrir também qualquer ambiente de staging/preview.
    enabled: true,
  },
  // nextCookies PRECISA ser o último plugin do array — fora dessa posição
  // ele falha silenciosamente (não seta os cookies de resposta).
  plugins: [nextCookies()],
});

export { auth };
