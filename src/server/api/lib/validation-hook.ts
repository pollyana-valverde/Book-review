import "server-only";
import type { Context } from "hono";
import type { ZodError } from "zod";

type ZodValidationResult = { success: true } | { success: false; error: ZodError };

/**
 * `defaultHook` do OpenAPIHono: substitui o formato default de erro 400 do
 * pacote pelo envelope padrão da API ({ error: { code, message } }). Passado
 * ao construtor de cada `new OpenAPIHono({ defaultHook: zodValidationHook })`
 * — cada módulo de rotas monta sua própria instância, então cada uma precisa
 * receber o hook.
 */
function zodValidationHook(result: ZodValidationResult, c: Context) {
  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(", ");

    return c.json({ error: { code: "VALIDATION_ERROR", message } }, 400);
  }
}

export { zodValidationHook };
