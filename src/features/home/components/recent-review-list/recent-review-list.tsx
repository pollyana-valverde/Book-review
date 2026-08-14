import { getRecentReviews } from "@/server/modules/reviews/review.queries";
import { getSession } from "@/server/auth/session";

import { ReviewCard } from "@/features/reviews";
import { EmptyState } from "@/components/ui/empty-state";

import { BookOpenIcon } from "lucide-react";

async function RecentReviewList() {
  const { user } = (await getSession())!;
  const bookReviews = await getRecentReviews(user.id, 4);

  const hasReviews = bookReviews.length > 0;

  if (!hasReviews) {
    return (
      <EmptyState
        icon={BookOpenIcon}
        title="Nenhuma resenha encontrada"
        description="Crie resenhas para seus livros favoritos e elas aparecerão aqui."
        action={{ label: "Escrever resenha", href: "/new-review" }}
      />
    );
  }

  return (
    <div
      className={`grid 
    sm:grid-cols-2 gap-3
    `}
    >
      {bookReviews.map((book) => (
        <ReviewCard key={book.id} review={book} />
      ))}
    </div>
  );
}

export { RecentReviewList };
