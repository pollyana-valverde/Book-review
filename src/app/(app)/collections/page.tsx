import type { Metadata } from "next";
import { CollectionsPage } from "@/template/collections-page";

export const metadata: Metadata = {
  title: "Coleções",
};

export default function Collections() {
  return <CollectionsPage />;
}
