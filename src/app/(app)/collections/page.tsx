import type { Metadata } from "next";
import { CollectionsPage } from "@/features/collections";

export const metadata: Metadata = {
  title: "Coleções",
};

export default function Collections() {
  return <CollectionsPage />;
}
