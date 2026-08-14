import type { Metadata } from "next";
import { NewReviewPage } from "@/features/reviews";

export const metadata: Metadata = {
  title: "Nova Resenha",
};

export default function NewReview() {
  return <NewReviewPage />;
}
