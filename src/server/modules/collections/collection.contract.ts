import z from "zod";

const createCollectionSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
});

const collectionDTOSchema = z.object({
  id: z.string(),
  title: z.string(),
});

const collectionWithReviewCountDTOSchema = collectionDTOSchema.extend({
  reviewsCount: z.number(),
});

type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
type CollectionDTO = z.infer<typeof collectionDTOSchema>;
type CollectionWithReviewCountDTO = z.infer<typeof collectionWithReviewCountDTOSchema>;

export {
  createCollectionSchema,
  collectionDTOSchema,
  collectionWithReviewCountDTOSchema,
  type CreateCollectionInput,
  type CollectionDTO,
  type CollectionWithReviewCountDTO,
};
