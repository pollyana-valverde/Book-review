import "server-only";
import { ZodError } from "zod";
import { AppError } from "@/server/lib/errors";

type ActionResult = { success: boolean; error?: string };

function toActionResult(error: unknown): ActionResult {
  if (error instanceof ZodError) {
    return {
      success: false,
      error: error.issues.map((issue) => issue.message).join(", "),
    };
  }

  if (error instanceof AppError) {
    return { success: false, error: error.message };
  }

  console.error(error);
  return { success: false, error: "Algo deu errado. Tente novamente." };
}

export { toActionResult, type ActionResult };
