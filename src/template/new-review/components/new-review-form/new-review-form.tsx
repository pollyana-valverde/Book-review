"use client";

import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
  InputGroupText,
  InputGroupAddon,
} from "@/components/ui/input-group";

import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { albumsList } from "@/utils";

import { useState } from "react";
import { Button } from "@/components/ui/button";

function NewReviewForm() {
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <form action="" className="flex flex-col gap-7">
      <div className="grid gap-4 md:grid-cols-2">
        <Field className="gap-1">
          <FieldLabel htmlFor="title" className="text-muted-foreground">
            Título do livro
          </FieldLabel>
          <InputGroup>
            <InputGroupInput id="title" placeholder="Ex: O senhor dos anéis" />
          </InputGroup>
        </Field>

        <Field className="gap-1">
          <FieldLabel htmlFor="author" className="text-muted-foreground">
            Autor
          </FieldLabel>
          <InputGroup>
            <InputGroupInput id="author" placeholder="Ex: J.R.R. Tolkein" />
          </InputGroup>
        </Field>
      </div>

      <Field className="gap-1 ">
        <FieldLabel htmlFor="category" className="text-muted-foreground">
          Album
        </FieldLabel>
        <div className="flex flex-wrap gap-2">
          {albumsList.map((album, index) => (
            <Badge
              className={cn(
                selectedAlbum === album.badge
                  ? "ring-2 ring-offset-2 ring-current"
                  : ""
              )}
              key={`${album.badge}-${index}`}
              size="lg"
              variant={selectedAlbum === album.badge ? album.badge : "default"}
              onClick={() => setSelectedAlbum(album.badge)}
            >
              {album.name}
            </Badge>
          ))}
        </div>
      </Field>

      <Field className="gap-1">
        <FieldLabel htmlFor="category" className="text-muted-foreground">
          Nota
          {selectedRating > 0 && (
            <Text variant="content-1" className="text-foreground font-bold">
              {selectedRating}/5
            </Text>
          )}
        </FieldLabel>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating, index) => (
            <StarIcon
              onMouseEnter={() => setHoverRating(rating)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setSelectedRating(rating)}
              className={cn(
                "text-border w-5 h-5 hover:text-amber-400 hover:fill-amber-400 transition-colors",
                selectedRating >= rating || hoverRating >= rating
                  ? "text-amber-400 fill-amber-400"
                  : ""
              )}
              key={index}
            />
          ))}
        </div>
      </Field>

      <Field className="gap-1">
        <FieldLabel htmlFor="description" className="text-muted-foreground">
          Resenha
        </FieldLabel>

        <InputGroup>
          <InputGroupTextarea
            className="min-h-50"
            id="description"
            placeholder="O que você achou deste livro?"
          />
          <InputGroupAddon align="block-end">
            <InputGroupText>0/280</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <div className="flex gap-2 ">
        <Button size="lg" type="submit">
          Salvar resenha
        </Button>
        <Button size="lg" type="reset" variant="outline">
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export { NewReviewForm };
