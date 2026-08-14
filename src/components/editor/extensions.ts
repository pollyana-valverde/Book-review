import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

// Compartilhado entre cliente (useEditor) e servidor
// (sanitizeRichText/renderToReactElement) de propósito: é o que garante
// que validação e renderização usem exatamente o mesmo conjunto de nós.
// Não pode ter "server-only" nem imports de servidor.
const extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
  }),
  Placeholder.configure({
    placeholder: "O que você achou deste livro?",
  }),
];

export { extensions };
