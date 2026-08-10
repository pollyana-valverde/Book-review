import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/globals.css";

import { Toaster } from "sonner";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book Review",
  description:
    "Uma plataforma para compartilhar resenhas de livros e álbuns de música.",
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
