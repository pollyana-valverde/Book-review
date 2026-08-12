import "server-only";
import type { Album } from "@/generated/prisma/client";
import type {
  AlbumDTO,
  AlbumWithReviewCountDTO,
} from "@/server/modules/albums/album.contract";

function toAlbumDTO(album: Pick<Album, "id" | "title">): AlbumDTO {
  return { id: album.id, title: album.title };
}

function toAlbumWithReviewCountDTO(
  album: Pick<Album, "id" | "title"> & { _count: { reviews: number } }
): AlbumWithReviewCountDTO {
  return {
    id: album.id,
    title: album.title,
    reviewsCount: album._count.reviews,
  };
}

export { toAlbumDTO, toAlbumWithReviewCountDTO };
