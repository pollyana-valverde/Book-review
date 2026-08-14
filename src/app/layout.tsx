import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/globals.css";

import { Toaster } from "sonner";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Book Review",
    template: "%s | Book Review",
  },
  description:
    "Uma plataforma para criar, organizar e consultar resenhas de livros por coleções.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${roboto.variable} antialiased font-sans`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
