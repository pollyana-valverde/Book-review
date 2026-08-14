import type { RichTextContent } from "@/server/modules/reviews/review.contract";

function validContent(text = "conteúdo de teste"): RichTextContent {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }],
      },
    ],
  };
}

export { validContent };
