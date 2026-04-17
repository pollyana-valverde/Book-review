import z from "zod";

const albumDataSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
});

type AlbumDataValues = z.infer<typeof albumDataSchema>;

export { albumDataSchema, type AlbumDataValues };
