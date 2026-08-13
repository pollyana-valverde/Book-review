-- Migração de ownership (fase 6): Album e Review passam a pertencer a um
-- usuário. Escrita para rodar de forma segura em um banco COM dados, não
-- só no banco vazio deste ambiente (que tem 0 linhas em albums/reviews/user
-- hoje — verificado antes de escrever esta migração).
--
-- Estratégia em três passos (expand -> backfill -> contract), porque
-- adicionar uma coluna NOT NULL direto falha em qualquer tabela com linhas
-- existentes:
--   1) adiciona user_id NULLABLE;
--   2) faz backfill das linhas existentes;
--   3) só então torna a coluna NOT NULL.
--
-- Dono do backfill: por padrão, o usuário mais antigo (menor createdAt) —
-- é o único critério que uma migração SQL estática consegue expressar sem
-- depender de nada externo. Para apontar um dono específico em vez do mais
-- antigo, defina a GUC de sessão do Postgres `app.seed_owner_email` ANTES
-- de rodar esta migração (ex.: via `psql -c "SET app.seed_owner_email =
-- 'dono@example.com';"` na mesma sessão/transação, ou
-- `SET app.seed_owner_email = '...'` no início de um `psql -f`). Migrações
-- SQL não têm acesso a variáveis de ambiente do processo Node — não dá pra
-- ler SEED_OWNER_EMAIL diretamente daqui; a GUC é o mecanismo equivalente
-- dentro do Postgres. Se nenhuma GUC for setada, cai no fallback (mais
-- antigo). Se não houver NENHUM usuário na tabela e existirem linhas em
-- albums/reviews para adotar, o passo 3 falha alto e claro (constraint
-- NOT NULL), em vez de silenciosamente perder dados.

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_categoryId_fkey";

-- DropIndex (constraints únicos globais antigos — o bug de multi-tenancy)
DROP INDEX "albums_title_key";
DROP INDEX "reviews_title_key";

-- AlterTable: expand (coluna nullable primeiro)
ALTER TABLE "albums" ADD COLUMN "user_id" TEXT;
ALTER TABLE "reviews" ADD COLUMN "user_id" TEXT;

-- Backfill: linhas existentes (nesta base, nenhuma) recebem o dono padrão.
UPDATE "albums"
SET "user_id" = COALESCE(
  (SELECT id FROM "user" WHERE email = NULLIF(current_setting('app.seed_owner_email', true), '') LIMIT 1),
  (SELECT id FROM "user" ORDER BY "createdAt" ASC LIMIT 1)
)
WHERE "user_id" IS NULL;

UPDATE "reviews"
SET "user_id" = COALESCE(
  (SELECT id FROM "user" WHERE email = NULLIF(current_setting('app.seed_owner_email', true), '') LIMIT 1),
  (SELECT id FROM "user" ORDER BY "createdAt" ASC LIMIT 1)
)
WHERE "user_id" IS NULL;

-- AlterTable: contract (agora sim, NOT NULL)
ALTER TABLE "albums" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "reviews" ALTER COLUMN "user_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "albums_user_id_idx" ON "albums"("user_id");
CREATE UNIQUE INDEX "albums_user_id_title_key" ON "albums"("user_id", "title");
CREATE INDEX "reviews_user_id_updated_at_idx" ON "reviews"("user_id", "updated_at" DESC);
CREATE INDEX "reviews_categoryId_idx" ON "reviews"("categoryId");
CREATE UNIQUE INDEX "reviews_user_id_title_key" ON "reviews"("user_id", "title");

-- AddForeignKey
-- categoryId agora é RESTRICT (era CASCADE): apagar um álbum com resenhas
-- dentro passa a ser recusado pelo banco em vez de apagar as resenhas
-- silenciosamente.
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "albums" ADD CONSTRAINT "albums_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
