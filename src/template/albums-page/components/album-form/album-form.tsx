"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { rpc } from "@/lib/rpc";
import {
  createAlbumSchema,
  type CreateAlbumInput,
} from "@/server/modules/albums/album.contract";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { toast } from "sonner";

type ApiErrorBody = { error: { code: string; message: string } };

function AlbumForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAlbumInput>({
    resolver: zodResolver(createAlbumSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(data: CreateAlbumInput) {
    const res = await rpc.api.albums.$post({ json: data });

    if (!res.ok) {
      // res.json() aqui é tipado a partir do caminho de sucesso — o RPC do
      // Hono não infere o formato do `onError` global. O corpo real segue
      // o contrato documentado em src/server/api/middlewares/error-handler.ts.
      const body = (await res.json()) as unknown as ApiErrorBody;
      setError("root", { message: body.error.message });
      return;
    }

    toast.success("Álbum criado com sucesso!");
    reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2" noValidate>
      <Field className="flex-1">
        <FieldLabel htmlFor="title" className="sr-only">
          Nome do álbum
        </FieldLabel>
        <Input
          id="title"
          placeholder="Nome do novo álbum..."
          aria-invalid={!!(errors.title || errors.root)}
          {...register("title")}
        />
        <FieldError errors={[errors.title, errors.root]} />
      </Field>
      <Button type="submit" variant="ghost" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Criando..." : "Criar"}
      </Button>
    </form>
  );
}

export { AlbumForm };
