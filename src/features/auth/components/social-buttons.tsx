"use client";

import { signIn } from "@/features/auth/lib/auth-client";
import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";

/**
 * `google`/`github` vêm computados no servidor (ver
 * src/server/auth/providers.ts) a partir de quais credenciais OAuth estão
 * configuradas — nunca aqui. Um provedor sem os dois valores simplesmente
 * não aparece: botão que leva a erro é pior que botão ausente.
 */
function SocialButtons({ google, github }: { google: boolean; github: boolean }) {
  if (!google && !github) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <FieldSeparator>ou</FieldSeparator>
      <div className="flex flex-col gap-2">
        {google && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => signIn.social({ provider: "google", callbackURL: "/" })}
          >
            Continuar com Google
          </Button>
        )}
        {github && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => signIn.social({ provider: "github", callbackURL: "/" })}
          >
            Continuar com GitHub
          </Button>
        )}
      </div>
    </div>
  );
}

export { SocialButtons };
