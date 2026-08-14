-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateIndex
CREATE INDEX "reviews_title_idx" ON "reviews" USING GIN ("title" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "reviews_content_text_idx" ON "reviews" USING GIN ("content_text" gin_trgm_ops);
