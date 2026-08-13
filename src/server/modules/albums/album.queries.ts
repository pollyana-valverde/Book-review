import "server-only";
import { unstable_cache } from "next/cache";
import * as albumService from "@/server/modules/albums/album.service";
import { albumsTag } from "@/server/lib/cache-tags";

// Ver o comentário equivalente em review.queries.ts sobre por que userId
// tem que estar na CHAVE, não só na tag.

function getAlbums(userId: string) {
  return unstable_cache(
    () => albumService.list(userId),
    ["albums-list", userId],
    { tags: [albumsTag(userId)] }
  )();
}

function getAlbumsWithReviewCount(userId: string) {
  return unstable_cache(
    () => albumService.listWithReviewCount(userId),
    ["albums-with-review-count", userId],
    { tags: [albumsTag(userId)] }
  )();
}

export { getAlbums, getAlbumsWithReviewCount };
