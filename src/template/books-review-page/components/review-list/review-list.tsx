"use client";

import { useState } from "react";
import { ReviewDTO } from "@/template/books-review-page/types";
import { rpc } from "@/lib/rpc";
import { readRpcError } from "@/lib/rpc-error";

import { ReviewCard } from "@/template/books-review-page/components/review-card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { EmptyState } from "@/components/ui/empty-state";

import { BookOpenIcon, Loader2Icon } from "lucide-react";

interface ReviewListProps {
  reviewsList: ReviewDTO[];
  nextCursor: string | null;
  title?: string;
  collectionId?: string;
}

function ReviewList({
  reviewsList,
  nextCursor,
  title,
  collectionId,
}: ReviewListProps) {
  const [items, setItems] = useState(reviewsList);
  const [cursor, setCursor] = useState(nextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const hasReviews = items.length > 0;

  async function loadMore() {
    if (!cursor) {
      return;
    }

    setIsLoadingMore(true);
    setLoadError(null);

    const res = await rpc.api.reviews.$get({
      query: {
        title: title || undefined,
        collectionId: collectionId || undefined,
        cursor,
      },
    });

    if (!res.ok) {
      const error = await readRpcError(res);
      setLoadError(error.message);
      setIsLoadingMore(false);
      return;
    }

    const page = await res.json();
    setItems((current) => [...current, ...page.items]);
    setCursor(page.nextCursor);
    setIsLoadingMore(false);
  }

  if (!hasReviews) {
    return (
      <EmptyState
        icon={BookOpenIcon}
        title="Nenhuma resenha encontrada"
        description="Tente ajustar sua pesquisa ou filtro para encontrar o que você está procurando."
        action={{ label: "Escrever resenha", href: "/new-review" }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className={`grid
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4 gap-3
       `}
      >
        {items.map((book) => (
          <ReviewCard key={book.id} review={book} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        {loadError && (
          <Text variant="content-1" className="text-destructive">
            {loadError}
          </Text>
        )}

        {cursor ? (
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <Loader2Icon className="animate-spin" />
                Carregando...
              </>
            ) : loadError ? (
              "Tentar novamente"
            ) : (
              "Carregar mais"
            )}
          </Button>
        ) : (
          <Text variant="content-1" className="text-muted-foreground">
            Você chegou ao fim da lista.
          </Text>
        )}
      </div>
    </div>
  );
}

export { ReviewList };
