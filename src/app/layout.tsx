import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Navbar, MobileNavbar } from "@/components/layout";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book Review",
  description: "Uma plataforma para compartilhar resenhas de livros e álbuns de música.",
  icons:{
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${roboto.variable} antialiased font-sans`}>
        <Navbar />
        <div
          className={`
          container mx-auto px-4 py-5 
          mb-14 md:mb-0 md:mt-15`}
        >
          {children}
        </div>
        <MobileNavbar />
      </body>
    </html>
  );
}
