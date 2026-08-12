import z from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.url("DATABASE_URL deve ser uma URL de conexão válida com o Postgres."),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
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

/** Apenas para código de servidor (services, prisma). Nunca importe a partir de um Client Component. */
const serverEnv = skipValidation
  ? ({
      DATABASE_URL: process.env.DATABASE_URL as string,
      NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") ?? "development",
    } satisfies z.infer<typeof serverEnvSchema>)
  : parseServerEnv();

/** Seguro para uso em Client Components. */
const clientEnv = skipValidation
  ? ({
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL as string,
    } satisfies z.infer<typeof clientEnvSchema>)
  : parseClientEnv();

const env = { ...serverEnv, ...clientEnv };

export { env, serverEnv, clientEnv };
