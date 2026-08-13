import type { Metadata } from "next";
import { HomePage } from "@/template/home-page";

export const metadata: Metadata = {
  title: "Painel",
};

export default function Home() {
  return <HomePage />;
}
