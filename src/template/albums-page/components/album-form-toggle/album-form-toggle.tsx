"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AlbumForm } from "@/template/albums-page/components/album-form";

import { PlusIcon } from "lucide-react";

function AlbumFormToggle() {
  const [openAlbumForm, setOpenAlbumForm] = useState(false);

  return (
    <>
      <Button
        className="md:absolute md:top-4 md:right-0 md:w-auto w-full"
        size="lg"
        onClick={() => setOpenAlbumForm(!openAlbumForm)}
      >
        <PlusIcon /> Novo Álbum
      </Button>

      {openAlbumForm && <AlbumForm />}
    </>
  );
}

export { AlbumFormToggle };
