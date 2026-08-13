import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SignUpForm, SocialButtons } from "@/features/auth";
import { getEnabledSocialProviders } from "@/server/auth/providers";

export const metadata: Metadata = {
  title: "Criar conta",
};

export default function SignUp() {
  const providers = getEnabledSocialProviders();

  return (
    <>
      <CardHeader className="gap-0">
        <CardTitle>
          <Text variant={"heading-1"}>Criar conta</Text>
        </CardTitle>
        <CardDescription>Comece a organizar suas resenhas</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Suspense>
          <SignUpForm />
        </Suspense>
        <SocialButtons google={providers.google} github={providers.github} />
      </CardContent>
      <CardFooter className="flex justify-center">
        Já tem conta?{" "}
        <Link href={"/sign-in"} className="ml-1 font-bold hover:underline">
          Entrar.
        </Link>
      </CardFooter>
    </>
  );
}
