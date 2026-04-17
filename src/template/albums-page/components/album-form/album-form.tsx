"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAlbum } from "@/api/actions";
import {
  AlbumDataValues,
  albumDataSchema,
} from "@/api/actions/album-actions/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";

function AlbumForm() {
  const form = useForm<AlbumDataValues>({
    resolver: zodResolver(albumDataSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(data: AlbumDataValues) {
    const album = await createAlbum({
      ...data,
    });

    if (album?.error) {
      toast.error(album.error);
      return { success: false };
    }

    toast.success("Álbum criado com sucesso!");

    form.reset();

    return { success: true };
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  id="title"
                  placeholder="Nome do novo álbum..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="ghost" size="lg">
          Criar
        </Button>
      </form>
    </Form>
  );
}

export { AlbumForm };
