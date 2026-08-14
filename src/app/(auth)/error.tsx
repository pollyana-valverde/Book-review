"use client";

import { useEffect } from "react";
import { AlertTriangleIcon, RotateCwIcon } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function AuthError({
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
    <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
      <div className="bg-destructive/10 text-destructive dark:bg-destructive/20 rounded-full p-3">
        <AlertTriangleIcon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <Text as="h2" variant="heading-3">
          Algo deu errado
        </Text>
        <Text as="p" className="text-muted-foreground">
          Não foi possível concluir esta ação. Tente novamente.
        </Text>
      </div>
      <Button onClick={() => reset()}>
        <RotateCwIcon />
        Tentar novamente
      </Button>
    </CardContent>
  );
}
