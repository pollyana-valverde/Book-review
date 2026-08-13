"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReview } from "@/server/actions";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";

import { StarIcon } from "lucide-react";

interface NewReviewFormProps {
  collectionsList: CollectionDTO[];
}

function NewReviewForm({ collectionsList }: NewReviewFormProps) {
  const form = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      title: "",
      author: "",
      collectionId: "",
      rating: 0,
      description: "",
    },
  });

  const selectedCollection = useWatch({
    control: form.control,
    name: "collectionId",
  });

  const selectedRating = useWatch({
    control: form.control,
    name: "rating",
  });

  const [hoverRating, setHoverRating] = useState(0);

  async function onSubmit(data: CreateReviewInput) {
    const review = await createReview({
      ...data,
    });

    if (review?.error) {
      toast.error(review.error);
      return { success: false };
    }

    toast.success("Resenha salva com sucesso!");

    form.reset();

    return { success: true };
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-7"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="title" className="text-muted-foreground">
                  Título do livro
                </FormLabel>
                <FormControl>
                  <Input
                    id="title"
                    placeholder="Ex: O senhor dos anéis"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="author" className="text-muted-foreground">
                  Autor
                </FormLabel>
                <FormControl>
                  <Input
                    id="author"
                    placeholder="Ex: J.R.R. Tolkien"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="collectionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="collectionId" className="text-muted-foreground">
                Coleção
              </FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="rating" className="text-muted-foreground">
                Nota
                {selectedRating > 0 && (
                  <Text
                    variant="content-1"
                    className="text-foreground font-bold"
                  >
                    {selectedRating}/5
                  </Text>
                )}
              </FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating, index) => (
                    <StarIcon
                      onMouseEnter={() => setHoverRating(rating)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => field.onChange(rating)}
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor="description"
                className="text-muted-foreground"
              >
                Resenha
              </FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none min-h-55"
                  id="description"
                  placeholder="O que você achou deste livro?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 ">
          <Button
            size="lg"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Salvando..." : "Salvar resenha"}
          </Button>
          <Button size="lg" type="reset" variant="outline" asChild>
            <Link href="/books-review">Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { NewReviewForm };
