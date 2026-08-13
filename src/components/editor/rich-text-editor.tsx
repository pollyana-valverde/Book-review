"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { extensions } from "@/components/editor/extensions";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value?: JSONContent;
  onChange: (value: JSONContent) => void;
  onBlur?: () => void;
  "aria-invalid"?: boolean;
  id?: string;
}

function RichTextEditor({
  value,
  onChange,
  onBlur,
  "aria-invalid": ariaInvalid,
  id,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions,
    content: value,
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
