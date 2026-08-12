import z from "zod";

const createAlbumSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
});

const albumDTOSchema = z.object({
  id: z.string(),
  title: z.string(),
});

const albumWithReviewCountDTOSchema = albumDTOSchema.extend({
  reviewsCount: z.number(),
});

type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
type AlbumDTO = z.infer<typeof albumDTOSchema>;
type AlbumWithReviewCountDTO = z.infer<typeof albumWithReviewCountDTOSchema>;

export {
  createAlbumSchema,
  albumDTOSchema,
  albumWithReviewCountDTOSchema,
  type CreateAlbumInput,
  type AlbumDTO,
  type AlbumWithReviewCountDTO,
};
