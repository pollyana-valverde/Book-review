import z from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.url("DATABASE_URL deve ser uma URL de conexão válida com o Postgres."),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET deve ter pelo menos 32 caracteres."),
  BETTER_AUTH_URL: z
    .url("BETTER_AUTH_URL deve ser uma URL válida.")
    .optional(),
  // Credenciais OAuth são opcionais: o app precisa subir e funcionar com
  // e-mail/senha mesmo sem elas. Cada provedor social só é registrado em
  // src/server/auth/auth.ts quando SEU PAR (id + secret) existe por
  // completo — ver src/server/auth/providers.ts.
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url("NEXT_PUBLIC_APP_URL deve ser uma URL válida."),
});

function formatIssues(error: z.ZodError) {
  return error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(raiz)"}: ${issue.message}`)
    .join("\n");
}

function parseServerEnv() {
  const parsed = serverEnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  });

  if (!parsed.success) {
    throw new Error(
      `Variáveis de ambiente de servidor inválidas:\n${formatIssues(parsed.error)}`
    );
  }

  return parsed.data;
}

function parseClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    // Acesso literal: o Next só substitui NEXT_PUBLIC_* quando referenciado assim.
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    throw new Error(
      `Variáveis de ambiente de cliente inválidas:\n${formatIssues(parsed.error)}`
    );
  }

  return parsed.data;
}

const skipValidation = Boolean(process.env.SKIP_ENV_VALIDATION);

let cachedServerEnv: z.infer<typeof serverEnvSchema> | undefined;

/**
 * Computa e valida as variáveis de servidor só na primeira leitura (nunca no
 * carregamento do módulo). Isso é o que torna seguro importar `env` a partir
 * de um Client Component (ex.: `src/lib/rpc.ts`) para ler só
 * `NEXT_PUBLIC_APP_URL`: se a validação de `DATABASE_URL` rodasse no
 * carregamento do módulo, o bundle do cliente quebraria no browser (onde
 * `DATABASE_URL` nunca existe). `DATABASE_URL`/`NODE_ENV` só são de fato
 * avaliados quando algo os lê — o que só acontece em código de servidor.
 */
function getServerEnv() {
  if (!cachedServerEnv) {
    cachedServerEnv = skipValidation
      ? ({
          DATABASE_URL: process.env.DATABASE_URL as string,
          NODE_ENV:
            (process.env.NODE_ENV as "development" | "production" | "test") ??
            "development",
          BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
          BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
          GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
          GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        } satisfies z.infer<typeof serverEnvSchema>)
      : parseServerEnv();
  }

  return cachedServerEnv;
}

/** Seguro para uso em Client Components. */
const clientEnv = skipValidation
  ? ({
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL as string,
    } satisfies z.infer<typeof clientEnvSchema>)
  : parseClientEnv();

const env = {
  ...clientEnv,
  get DATABASE_URL() {
    return getServerEnv().DATABASE_URL;
  },
  get NODE_ENV() {
    return getServerEnv().NODE_ENV;
  },
  get BETTER_AUTH_SECRET() {
    return getServerEnv().BETTER_AUTH_SECRET;
  },
  get BETTER_AUTH_URL() {
    return getServerEnv().BETTER_AUTH_URL;
  },
  get GOOGLE_CLIENT_ID() {
    return getServerEnv().GOOGLE_CLIENT_ID;
  },
  get GOOGLE_CLIENT_SECRET() {
    return getServerEnv().GOOGLE_CLIENT_SECRET;
  },
  get GITHUB_CLIENT_ID() {
    return getServerEnv().GITHUB_CLIENT_ID;
  },
  get GITHUB_CLIENT_SECRET() {
    return getServerEnv().GITHUB_CLIENT_SECRET;
  },
};

export { env, clientEnv };
