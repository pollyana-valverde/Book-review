import type { Metadata } from "next";
import { ReviewDetailPage } from "@/template/books-review-page";
import { getReviewById } from "@/server/modules/reviews/review.queries";
import { getSession } from "@/server/auth/session";
import { NotFoundError } from "@/server/lib/errors";

interface ReviewDetailProps {
  params: Promise<{ id: string }>;
}

// Página autenticada: NUNCA coloque conteúdo/excerpt/nota da resenha aqui
// (vazaria em preview de link caso a URL seja compartilhada) — só
// título e autor, que é o que a tarefa pede. `robots: { index: false }`
// porque é conteúdo pessoal do usuário, não deveria ser indexado.
export async function generateMetadata({
  params,
}: ReviewDetailProps): Promise<Metadata> {
  const session = await getSession();

  if (!session) {
    return { title: "Resenha" };
  }

  const { id } = await params;

  try {
    const review = await getReviewById(session.user.id, id);
    return {
      title: `${review.title} — ${review.author}`,
      robots: { index: false, follow: false },
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { title: "Resenha não encontrada" };
    }
    throw error;
  }
}

export default async function ReviewDetail({ params }: ReviewDetailProps) {
  const { id: reviewId } = await params;

  return <ReviewDetailPage id={reviewId} />;
}
