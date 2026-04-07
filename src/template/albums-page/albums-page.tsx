"use client";

import { Text } from "@/components/ui/text";
import { AlbumList } from "./componentes";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

import { PlusIcon } from "lucide-react";

import { useState } from "react";

function AlbumsPage() {
  const [openAlbumForm, setOpenAlbumForm] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
        <div>
          <Text as="h1" variant="heading-1">
            Álbuns
          </Text>
          <Text as="p" className="text-muted-foreground">
            Organize seus livros por categorias
          </Text>
        </div>

        <Button size="lg" onClick={() => setOpenAlbumForm(!openAlbumForm)}>
          <PlusIcon /> Novo Álbum
        </Button>
      </div>

      {openAlbumForm && (
        <form className="flex gap-2">
          <Field className="flex-1">
            <InputGroup>
              <InputGroupInput
                id="inline-start-input"
                placeholder="Nome do novo álbum..."
              />
            </InputGroup>
          </Field>

          <Button type="submit" variant="ghost" size="lg">
            Criar
          </Button>
        </form>
      )}

      <AlbumList />
    </div>
  );
}

export { AlbumsPage };
