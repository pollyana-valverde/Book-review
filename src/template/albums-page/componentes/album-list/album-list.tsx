import { AlbumCard } from "@/template/albums-page/componentes";

import { albumsList } from "@/utils";

function AlbumList() {
  return (
    <div
      className={`grid 
        sm:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4 gap-3
       `}
    >
      {albumsList.map((album, index) => (
        <AlbumCard key={`${album}-${index}`} album={album} />
      ))}
    </div>
  );
}

export { AlbumList };
