import type { Metadata } from "next";
import { NewReviewPage } from "@/template/new-review";

export const metadata: Metadata = {
  title: "Nova Resenha",
};

export default function NewReview() {
  return <NewReviewPage />;
}
