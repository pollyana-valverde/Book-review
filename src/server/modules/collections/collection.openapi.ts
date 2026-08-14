import "server-only";
// Side effect: ver comentário equivalente em review.openapi.ts.
import "@hono/zod-openapi";
import z from "zod";
import {
  createCollectionSchema,
  collectionDTOSchema,
} from "@/server/modules/collections/collection.contract";

const collectionIdParamSchema = z.object({
  id: z.string().openapi({
    param: { name: "id", in: "path" },
    example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  }),
});

const collectionResponseSchema = collectionDTOSchema.openapi("Collection", {
  description: "Uma coleção usada para organizar resenhas",
});

const collectionsListResponseSchema = z
  .array(collectionDTOSchema)
  .openapi("CollectionsList", { description: "Lista de coleções" });

const createCollectionBodySchema = createCollectionSchema.openapi("CreateCollection");

export {
  collectionIdParamSchema,
  collectionResponseSchema,
  collectionsListResponseSchema,
  createCollectionBodySchema,
};
