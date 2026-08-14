import "server-only";
import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { AppError } from "@/server/lib/errors";
import type { AppEnv } from "@/server/api/factory";

/**
 * `AppError.status` é `number` no domínio (não depende do Hono). O cast para
 * `ContentfulStatusCode` fica isolado aqui, na borda de transporte, onde de
 * fato importa que o valor seja um StatusCode válido para `c.json`.
 *
 * Atenção: o cliente RPC do Hono (`hc`) NÃO infere o formato de resposta
 * definido em `app.onError` — o tipo de retorno de cada rota, para o RPC,
 * é só o que a própria rota retorna nos casos de sucesso. Por isso todo
 * chamador do RPC precisa checar `res.ok` antes de tratar o corpo como
 * sucesso; no caminho de erro, o formato é este `{ error: { code, message } }`
 * mas isso não é garantido pelo tipo — é um contrato documentado aqui.
 */
const errorHandler: ErrorHandler<AppEnv> = (error, c) => {
  if (error instanceof AppError) {
    return c.json(
      { error: { code: error.code, message: error.message } },
      error.status as ContentfulStatusCode
    );
  }

  console.error(error);

  return c.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Algo deu errado. Tente novamente.",
      },
    },
    500
  );
};

export { errorHandler };
