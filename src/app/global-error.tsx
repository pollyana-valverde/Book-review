"use client";

import { useEffect } from "react";
import "@/styles/globals.css";

// Só entra em cena se o próprio layout raiz falhar — precisa renderizar
// <html>/<body> porque substitui a árvore inteira, inclusive o layout.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="pt-br">
      <body className="antialiased font-sans">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <h2 className="text-2xl font-semibold">Algo deu errado</h2>
          <p className="text-muted-foreground max-w-md">
            Não foi possível carregar a aplicação. Tente novamente em
            instantes.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-xl bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
