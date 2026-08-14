"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { rpc } from "@/lib/rpc";
import { readRpcError } from "@/lib/rpc-error";
import {
  createCollectionSchema,
  type CreateCollectionInput,
} from "@/server/modules/collections/collection.contract";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { toast } from "sonner";

function CollectionForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCollectionInput>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(data: CreateCollectionInput) {
    const res = await rpc.api.collections.$post({ json: data });

    if (!res.ok) {
      const error = await readRpcError(res);
      setError("root", { message: error.message });
      return;
    }

    toast.success("Coleção criada com sucesso!");
    reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2" noValidate>
      <Field className="flex-1">
        <FieldLabel htmlFor="title" className="sr-only">
          Nome da coleção
        </FieldLabel>
        <Input
          id="title"
          placeholder="Nome da nova coleção..."
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

export { CollectionForm };
