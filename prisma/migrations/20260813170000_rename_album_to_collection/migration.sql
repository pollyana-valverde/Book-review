-- Renomeia Album -> Collection preservando dados, chaves estrangeiras e
-- índices. O Prisma, ao diffar o schema, gera isto como DROP TABLE
-- "albums" + CREATE TABLE "collections" (confirmado com `prisma migrate
-- diff --script` antes de escrever este arquivo) — o que destruiria todas
-- as linhas. Esta migração foi editada à mão para usar apenas RENAME.

-- 1) Renomeia a tabela. Preserva linhas, PK, FKs e índices que apontam
--    para ela — Postgres atualiza as referências automaticamente.
ALTER TABLE "albums" RENAME TO "collections";

-- 2) Renomeia a coluna de FK em reviews (antes "categoryId", sem @map;
--    agora "collection_id", com @map("collection_id") no schema).
ALTER TABLE "reviews" RENAME COLUMN "categoryId" TO "collection_id";

-- 3) Renomeia constraints e índices que carregavam "album"/"category",
--    para não deixar nomes desalinhados com o schema (causa de falhas
--    confusas em migrações futuras).
ALTER TABLE "collections" RENAME CONSTRAINT "albums_pkey" TO "collections_pkey";
ALTER TABLE "collections" RENAME CONSTRAINT "albums_user_id_fkey" TO "collections_user_id_fkey";
ALTER INDEX "albums_user_id_idx" RENAME TO "collections_user_id_idx";
ALTER INDEX "albums_user_id_title_key" RENAME TO "collections_user_id_title_key";

ALTER TABLE "reviews" RENAME CONSTRAINT "reviews_categoryId_fkey" TO "reviews_collection_id_fkey";
ALTER INDEX "reviews_categoryId_idx" RENAME TO "reviews_collection_id_idx";
