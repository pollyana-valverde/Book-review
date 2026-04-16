"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteAlbum } from "@/api/actions";
import { getAlbumBadgeColor } from "@/lib/album-badge-color";

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

interface AlbumCardDTO {
  album: {
    id: string;
    title: string;
  };
  countBooksInAlbum: (albumId: Album["id"]) => number;
}

function DeleteAlbumDialog({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    const deletedAlbum = await deleteAlbum(id);

    if (deletedAlbum.error) {
      toast.error(deletedAlbum.error);
      return;
    }

    toast.success("Álbum deletado com sucesso!");
    setIsDeleting(false);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DeleteIcon className="p-1 rounded-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:text-red-700 hover:bg-red-100" />
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <DeleteIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Deletar Álbum?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar este álbum? Esta ação não pode ser
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
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

async function AlbumCard({ album, countBooksInAlbum }: AlbumCardDTO) {
  const booksInThisAlbum = countBooksInAlbum(album.id);

  return (
    <Card className="gap-2">
      <CardHeader className="gap-3">
        <CardTitle className="flex justify-between items-start gap-4 w-full">
          <Badge style={getAlbumBadgeColor(album.id || album.title)} size="lg">
            {album.title}
          </Badge>
          <DeleteAlbumDialog id={album.id} />
        </CardTitle>

        <CardDescription className="flex gap-1.5 items-center">
          <BookOpenIcon className="w-4 h-4" />
          <Text as="p" variant="content-1" className="text-muted-foreground">
            {booksInThisAlbum >= 1 && booksInThisAlbum}{" "}
            {booksInThisAlbum > 1 && "livros"}
            {booksInThisAlbum === 1 && "livro"}
            {booksInThisAlbum === 0 && "Nenhum livro"}
          </Text>
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Button asChild variant="link" className="p-0 hover:pl-2">
          <Link
            href={`/books-review?title=&&category=${encodeURIComponent(album.id)}`}
          >
            Ver resenhas &rarr;
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export { AlbumCard };
