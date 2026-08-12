import "server-only";
import type { Context } from "hono";

type ZodValidationResult =
  | { success: true }
  | { success: false; error: { issues: { message: string }[] } };

/**
 * Hook do @hono/zod-validator: substitui o formato default de erro 400 do
 * pacote pelo envelope padrão da API ({ error: { code, message } }).
 */
function zodValidationHook(result: ZodValidationResult, c: Context) {
  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(", ");

    return c.json(
      { error: { code: "VALIDATION_ERROR", message } },
      400
    );
  }
}

export { zodValidationHook };
