import { describe, it, expect } from "vitest";
import { sanitizeRichText, toPlainText, toExcerpt } from "@/server/lib/rich-text";
import { ValidationError } from "@/server/lib/errors";

describe("sanitizeRichText", () => {
  it("aceita um documento válido e devolve JSON normalizado", () => {
    const doc = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Olá mundo" }] },
      ],
    };

    const result = sanitizeRichText(doc);

    expect(result).toMatchObject({
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Olá mundo" }] },
      ],
    });
  });

  it("rejeita nó fora da lista de extensões (ex.: script)", () => {
    const doc = { type: "doc", content: [{ type: "script" }] };

    expect(() => sanitizeRichText(doc)).toThrow(ValidationError);
  });

  it("rejeita documento acima do limite de ~100KB", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "a".repeat(200_000) }],
        },
      ],
    };

    expect(() => sanitizeRichText(doc)).toThrow(ValidationError);
  });

  it("aceita um parágrafo vazio (caso do backfill da fase 8)", () => {
    const doc = { type: "doc", content: [{ type: "paragraph" }] };

    expect(() => sanitizeRichText(doc)).not.toThrow();
  });
});

describe("toPlainText", () => {
  it("extrai texto de estrutura aninhada (lista dentro de citação)", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "blockquote",
          content: [
            {
              type: "bulletList",
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "item um" }],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "item dois" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const text = toPlainText(doc);

    expect(text).toContain("item um");
    expect(text).toContain("item dois");
  });
});

describe("toExcerpt", () => {
  it("devolve o texto como está quando cabe no limite", () => {
    expect(toExcerpt("um texto curto")).toBe("um texto curto");
  });

  it("corta sem partir palavra ao meio e adiciona reticências", () => {
    const text =
      "Esta é uma resenha bastante longa que precisa ser cortada em algum ponto razoável para caber no card sem quebrar uma palavra ao meio, o que ficaria estranho de ler.";

    const excerpt = toExcerpt(text, 50);

    expect(excerpt.length).toBeLessThanOrEqual(51); // 50 + "…"
    expect(excerpt.endsWith("…")).toBe(true);
    expect(excerpt.slice(0, -1).endsWith(" ")).toBe(false); // não termina no meio de uma palavra
    expect(text.startsWith(excerpt.slice(0, -1))).toBe(true);
  });

  it("normaliza espaços (inclusive quebras de linha do toPlainText)", () => {
    expect(toExcerpt("linha um\nlinha dois\n\nlinha três")).toBe(
      "linha um linha dois linha três"
    );
  });

  it("sem espaço para cortar (uma palavra só maior que o limite), corta cru", () => {
    const oneLongWord = "a".repeat(200);

    const excerpt = toExcerpt(oneLongWord, 50);

    expect(excerpt).toBe(`${"a".repeat(50)}…`);
  });
});
