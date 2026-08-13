"use client";

import { useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { rpc } from "@/lib/rpc";
import { readRpcError } from "@/lib/rpc-error";
import {
  type CreateReviewInput,
  createReviewSchema,
} from "@/server/modules/reviews/review.contract";
import type { CollectionDTO } from "@/server/modules/collections/collection.contract";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { getCollectionBadgeColor } from "@/lib/collection-badge-color";

import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RichTextEditor } from "@/components/editor/rich-text-editor";

import { toast } from "sonner";

import { StarIcon } from "lucide-react";

interface NewReviewFormProps {
  collectionsList: CollectionDTO[];
}

const emptyContent: CreateReviewInput["content"] = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

function NewReviewForm({ collectionsList }: NewReviewFormProps) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      title: "",
      author: "",
      collectionId: "",
      rating: 0,
      content: emptyContent,
    },
  });

  const selectedCollection = useWatch({ control, name: "collectionId" });
  const selectedRating = useWatch({ control, name: "rating" });

  const [hoverRating, setHoverRating] = useState(0);

  async function onSubmit(data: CreateReviewInput) {
    const res = await rpc.api.reviews.$post({ json: data });

    if (!res.ok) {
      const error = await readRpcError(res);
      setError("root", { message: error.message });
      return;
    }

    toast.success("Resenha salva com sucesso!");
    reset();
    router.refresh();
  }

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="title" className="text-muted-foreground">
            Título do livro
          </FieldLabel>
          <Input
            id="title"
            placeholder="Ex: O senhor dos anéis"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="author" className="text-muted-foreground">
            Autor
          </FieldLabel>
          <Input
            id="author"
            placeholder="Ex: J.R.R. Tolkien"
            aria-invalid={!!errors.author}
            {...register("author")}
          />
          <FieldError errors={[errors.author]} />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="collectionId" className="text-muted-foreground">
          Coleção
        </FieldLabel>
        <Controller
          control={control}
          name="collectionId"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2" id="collectionId">
              {collectionsList?.map((collection) => (
                <Badge
                  style={getCollectionBadgeColor(collection.id || collection.title)}
                  className={cn(
                    "border cursor-pointer",
                    selectedCollection === collection.id
                      ? "ring-2 ring-offset-2 ring-current"
                      : ""
                  )}
                  size="lg"
                  key={collection.id}
                  onClick={(event) => {
                    event.preventDefault();
                    field.onChange(collection.id);
                  }}
                >
                  {collection.title}
                </Badge>
              ))}
            </div>
          )}
        />
        <FieldError errors={[errors.collectionId]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="rating" className="text-muted-foreground">
          Nota
          {selectedRating > 0 && (
            <Text variant="content-1" className="text-foreground font-bold">
              {selectedRating}/5
            </Text>
          )}
        </FieldLabel>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <RadioGroup
              id="rating"
              aria-label="Nota"
              aria-invalid={!!errors.rating}
              value={field.value ? String(field.value) : undefined}
              onValueChange={(value) => field.onChange(Number(value))}
              onBlur={field.onBlur}
              className="gap-2"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <RadioGroupItem
                  value={String(rating)}
                  key={rating}
                  aria-label={`${rating} ${rating === 1 ? "estrela" : "estrelas"}`}
                  onMouseEnter={() => setHoverRating(rating)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <StarIcon
                    className={cn(
                      "text-border w-5 h-5 hover:text-amber-400 hover:fill-amber-400 transition-colors",
                      selectedRating >= rating || hoverRating >= rating
                        ? "text-amber-400 fill-amber-400"
                        : ""
                    )}
                  />
                </RadioGroupItem>
              ))}
            </RadioGroup>
          )}
        />
        <FieldError errors={[errors.rating]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="content" className="text-muted-foreground">
          Resenha
        </FieldLabel>
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <RichTextEditor
              id="content"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              aria-invalid={!!errors.content}
            />
          )}
        />
        <FieldError errors={[errors.content, errors.root]} />
      </Field>

      <div className="flex gap-2">
        <Button size="lg" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar resenha"}
        </Button>
        <Button size="lg" type="reset" variant="outline" asChild>
          <Link href="/books-review">Cancelar</Link>
        </Button>
      </div>
    </form>
  );
}

export { NewReviewForm };
