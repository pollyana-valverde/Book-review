-- Substitui `description` (texto simples) por `content` (documento
-- Tiptap/ProseMirror em JSON), com `content_text`/`excerpt` derivados.
--
-- O Prisma, ao diffar o schema, gera isto como um único `ALTER TABLE` que
-- adiciona `content`/`content_text`/`excerpt` como NOT NULL sem valor
-- default e derruba `description` na mesma instrução (confirmado com
-- `prisma migrate diff --script` antes de escrever este arquivo). Contra
-- uma tabela com linhas, isso falha (NOT NULL sem default e sem dado
-- ainda calculado); mesmo vazia, perderia a chance de preservar o texto
-- existente como conteúdo do editor. Por isso: expand -> backfill ->
-- contract, em três passos.

-- 1) Expand: as três colunas entram nullable.
ALTER TABLE "reviews" ADD COLUMN "content" JSONB;
ALTER TABLE "reviews" ADD COLUMN "content_text" TEXT;
ALTER TABLE "reviews" ADD COLUMN "excerpt" TEXT;

-- 2) Backfill: description vira um documento de um parágrafo.
--    CUIDADO: description vazia ou só com espaços geraria um nó de texto
--    vazio, que o ProseMirror rejeita (Node.check() falha) — para essas
--    linhas o documento fica só com um parágrafo vazio, sem nó de texto.
UPDATE "reviews"
SET
  "content" = CASE
    WHEN trim("description") = '' THEN
      jsonb_build_object(
        'type', 'doc',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'paragraph')
        )
      )
    ELSE
      jsonb_build_object(
        'type', 'doc',
        'content', jsonb_build_array(
          jsonb_build_object(
            'type', 'paragraph',
            'content', jsonb_build_array(
              jsonb_build_object('type', 'text', 'text', "description")
            )
          )
        )
      )
  END,
  "content_text" = "description",
  "excerpt" = LEFT("description", 180)
WHERE "content" IS NULL;

-- 3) Contract: agora que toda linha tem valor, torna NOT NULL e remove a
--    coluna antiga.
ALTER TABLE "reviews" ALTER COLUMN "content" SET NOT NULL;
ALTER TABLE "reviews" ALTER COLUMN "content_text" SET NOT NULL;
ALTER TABLE "reviews" ALTER COLUMN "excerpt" SET NOT NULL;
ALTER TABLE "reviews" DROP COLUMN "description";
