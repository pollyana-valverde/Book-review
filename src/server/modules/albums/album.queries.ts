import "server-only";
import { unstable_cache } from "next/cache";
import * as albumService from "@/server/modules/albums/album.service";
import { albumsTag } from "@/server/lib/cache-tags";

const getAlbums = unstable_cache(
  () => albumService.list(),
  ["albums-list"],
  { tags: [albumsTag()] }
);

const getAlbumsWithReviewCount = unstable_cache(
  () => albumService.listWithReviewCount(),
  ["albums-with-review-count"],
  { tags: [albumsTag()] }
);

export { getAlbums, getAlbumsWithReviewCount };
