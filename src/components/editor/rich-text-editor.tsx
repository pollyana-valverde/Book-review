"use client";

import { useState, useImperativeHandle } from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { extensions } from "@/components/editor/extensions";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { cn } from "@/lib/utils";

interface RichTextEditorHandle {
  /**
   * Limpa o documento do editor. `reset()` do react-hook-form NÃO alcança
   * o estado interno do Tiptap (o editor para de ouvir `value` depois do
   * mount — ver comentário abaixo) — por isso precisa ser chamado
   * explicitamente depois de salvar com sucesso.
   */
  clearContent: () => void;
}

interface RichTextEditorProps {
  value?: JSONContent;
  onChange: (value: JSONContent) => void;
  onBlur?: () => void;
  "aria-invalid"?: boolean;
  id?: string;
  ref?: React.Ref<RichTextEditorHandle>;
}

function RichTextEditor({
  value,
  onChange,
  onBlur,
  "aria-invalid": ariaInvalid,
  id,
  ref,
}: RichTextEditorProps) {
  // Enquanto o editor está montado, ELE é a fonte de verdade do documento
  // (histórico de undo/redo incluído) — `value` só serve para semear o
  // conteúdo INICIAL. Capturado uma única vez (inicializador preguiçoso do
  // useState, não lido de novo depois): se `value` (== field.value do
  // react-hook-form, um objeto novo a cada `onUpdate`) fosse repassado a
  // cada render para `content` do useEditor, o EditorInstanceManager do
  // @tiptap/react detecta a referência diferente e chama
  // `editor.setOptions(...)` a cada tecla — reconfiguração desnecessária e
  // frágil a cada keystroke que não deveria existir. `field.onChange`
  // continua alimentando o react-hook-form normalmente; só não volta a
  // entrar no editor durante a digitação. Sincronização de volta (carregar
  // uma resenha existente, limpar após salvar) é feita de forma explícita e
  // pontual, não a cada render.
  const [initialContent] = useState(() => value);

  const editor = useEditor({
    extensions,
    content: initialContent,
    // Sem isso o Next dá erro de hidratação: o editor tentaria renderizar
    // no servidor antes de existir DOM/contenteditable.
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    onBlur: () => {
      onBlur?.();
    },
    editorProps: {
      attributes: {
        id: id ?? "",
        role: "textbox",
        "aria-invalid": ariaInvalid ? "true" : "false",
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-40 px-3 py-2",
      },
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      clearContent: () => {
        editor?.commands.clearContent(true);
      },
    }),
    [editor]
  );

  return (
    <div
      data-invalid={ariaInvalid ? "true" : "false"}
      className={cn(
        "rounded-xl border border-input bg-transparent transition-[color]",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        "data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20 dark:data-[invalid=true]:ring-destructive/40"
      )}
    >
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

export { RichTextEditor };
export type { RichTextEditorHandle };
