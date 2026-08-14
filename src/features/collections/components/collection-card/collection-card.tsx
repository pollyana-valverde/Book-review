"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteCollection } from "@/server/actions";
import { getCollectionBadgeColor } from "@/lib/collection-badge-color";
import type { CollectionWithReviewCountDTO } from "@/server/modules/collections/collection.contract";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { BookOpenIcon, Trash2Icon as DeleteIcon } from "lucide-react";
import { toast } from "sonner";

interface CollectionCardDTO {
  collection: CollectionWithReviewCountDTO;
}

function DeleteCollectionDialog({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    const deletedCollection = await deleteCollection(id);

    if (deletedCollection.error) {
      toast.error(deletedCollection.error);
      setIsDeleting(false);
      return;
    }

    toast.success("Coleção deletada com sucesso!");
    setIsDeleting(false);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          aria-label="Deletar coleção"
          className="p-1 rounded-sm text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <DeleteIcon />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <DeleteIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Deletar Coleção?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar esta coleção? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deletando..." : "Deletar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CollectionCard({ collection }: CollectionCardDTO) {
  const booksInThisCollection = collection.reviewsCount;

  return (
    <Card className="gap-2">
      <CardHeader className="gap-3">
        <CardTitle className="flex justify-between items-start gap-4 w-full">
          <Badge style={getCollectionBadgeColor(collection.id || collection.title)} size="lg">
            {collection.title}
          </Badge>
          <DeleteCollectionDialog id={collection.id} />
        </CardTitle>

        <CardDescription className="flex gap-1.5 items-center">
          <BookOpenIcon className="w-4 h-4" />
          <Text as="p" variant="content-1" className="text-muted-foreground">
            {booksInThisCollection >= 1 && booksInThisCollection}{" "}
            {booksInThisCollection > 1 && "livros"}
            {booksInThisCollection === 1 && "livro"}
            {booksInThisCollection === 0 && "Nenhum livro"}
          </Text>
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Button asChild variant="link" className="p-0 hover:pl-2">
          <Link
            href={`/books-review?title=&&collection=${encodeURIComponent(collection.id)}`}
          >
            Ver resenhas &rarr;
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export { CollectionCard };
