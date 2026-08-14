import type { Metadata } from "next";
import { HomePage } from "@/features/home";

export const metadata: Metadata = {
  title: "Painel",
};

export default function Home() {
  return <HomePage />;
}
