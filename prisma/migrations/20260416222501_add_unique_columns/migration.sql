/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `albums` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "rating" SET DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "albums_title_key" ON "albums"("title");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_title_key" ON "reviews"("title");
