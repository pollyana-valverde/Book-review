"use client";

import { useEffect } from "react";
import { AlertTriangleIcon, RotateCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

// Mensagem sempre genérica: nunca expõe error.message (pode vazar detalhe
// técnico/interno) — só loga no console para investigação.
export default function AppError({
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
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="bg-destructive/10 text-destructive dark:bg-destructive/20 rounded-full p-3">
        <AlertTriangleIcon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <Text as="h2" variant="heading-3">
          Algo deu errado
        </Text>
        <Text as="p" className="text-muted-foreground max-w-md">
          Não foi possível carregar esta página. Tente novamente em
          instantes.
        </Text>
      </div>
      <Button onClick={() => reset()}>
        <RotateCwIcon />
        Tentar novamente
      </Button>
    </div>
  );
}
