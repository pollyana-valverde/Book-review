import { Suspense } from "react";
import Link from "next/link";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SignInForm, SocialButtons } from "@/features/auth";
import { getEnabledSocialProviders } from "@/server/auth/providers";

export default function SignIn() {
  const providers = getEnabledSocialProviders();

  return (
    <>
      <CardHeader className="gap-0">
        <CardTitle>
          <Text variant={"heading-1"}>Entrar</Text>
        </CardTitle>
        <CardDescription>Continue de onde parou</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Suspense>
          <SignInForm />
        </Suspense>
        <SocialButtons google={providers.google} github={providers.github} />
      </CardContent>
      <CardFooter className="flex justify-center">
        Não tem conta?{" "}
        <Link href={"/sign-up"} className="ml-1 font-bold hover:underline">
          Criar.
        </Link>
      </CardFooter>
    </>
  );
}
