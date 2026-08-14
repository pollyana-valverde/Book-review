import "server-only";
import { getSchema } from "@tiptap/core";
import { Node } from "@tiptap/pm/model";
import { extensions } from "@/components/editor/extensions";
import { ValidationError } from "@/server/lib/errors";

const schema = getSchema(extensions);

// ~100KB de JSON serializado. Barreira ANTES de qualquer parse — um payload
// gigante não deve nem chegar perto de Node.fromJSON.
const MAX_CONTENT_BYTES = 100 * 1024;

/**
 * Zod só confirma que `content` é um objeto com `type: "doc"` — a
 * validação de verdade é reconstruir o documento com o schema derivado das
 * extensões do editor (as mesmas de src/components/editor/extensions.ts).
 * Nós/marcas fora dessa lista não sobrevivem: `Node.fromJSON` lança, ou
 * `.check()` lança se a árvore reconstruída violar o schema (ex.: parágrafo
 * dentro de parágrafo). Qualquer falha vira ValidationError — é isso que
 * impede alguém de postar JSON arbitrário direto no endpoint.
 */
function sanitizeRichText(json: unknown): Record<string, unknown> {
  const serialized = JSON.stringify(json);
  const byteLength = Buffer.byteLength(serialized, "utf8");

  if (byteLength > MAX_CONTENT_BYTES) {
    throw new ValidationError(
      `O conteúdo excede o limite de ${MAX_CONTENT_BYTES / 1024}KB.`
    );
  }

  let doc: Node;

  try {
    doc = Node.fromJSON(schema, json);
    doc.check();
  } catch {
    throw new ValidationError("Conteúdo da resenha inválido.");
  }

  return doc.toJSON();
}

/**
 * Texto puro derivado do documento, com quebra de linha entre blocos (não
 * concatenado sem separador) — usado para `contentText` (busca) e como
 * base de `toExcerpt`.
 */
function toPlainText(doc: Record<string, unknown>): string {
  const node = Node.fromJSON(schema, doc);
  return node.textBetween(0, node.content.size, "\n", "\n");
}

/**
 * Resumo curto para os cards: normaliza espaços (inclusive as quebras de
 * `toPlainText`) e corta em `max` caracteres sem partir palavra ao meio,
 * com reticências quando o texto foi cortado.
 */
function toExcerpt(text: string, max = 180): string {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (normalized.length <= max) {
    return normalized;
  }

  const truncated = normalized.slice(0, max);
  const lastSpace = truncated.lastIndexOf(" ");
  const safeTruncated = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;

  return `${safeTruncated}…`;
}

export { sanitizeRichText, toPlainText, toExcerpt };
