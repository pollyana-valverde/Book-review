import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import { extensions } from "@/components/editor/extensions";
import type { JSONContent } from "@tiptap/react";
import { cn } from "@/lib/utils";

interface RichTextContentProps {
  content: JSONContent;
  className?: string;
}

// Renderiza o JSON salvo direto para React, sem instanciar um editor nem
// passar por HTML — elimina de vez a classe de risco de
// `dangerouslySetInnerHTML` (não há string HTML em nenhum momento). Usa as
// mesmas extensions do editor e da sanitização (Tarefa 3/4), então o que é
// renderizado aqui é sempre um subconjunto do que passou por
// `sanitizeRichText`.
function RichTextContent({ content, className }: RichTextContentProps) {
  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
      {renderToReactElement({ extensions, content })}
    </div>
  );
}

export { RichTextContent };
