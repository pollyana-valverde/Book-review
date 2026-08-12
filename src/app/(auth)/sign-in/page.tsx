import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import Link from "next/link";

export default function SignIn() {
  return (
    <>
      <CardHeader className="gap-0">
        <CardTitle>
          <Text variant={"heading-1"}>Entrar</Text>
        </CardTitle>
        <CardDescription>Continue de onde parou</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <FieldGroup className="gap-4">
            <Field className="gap-1">
              <FieldLabel>Email</FieldLabel>
              <Input type="email" placeholder="Digite seu email..." />
            </Field>
            <Field className="gap-1">
              <FieldLabel>Senha</FieldLabel>
              <Input type="password" placeholder="Digite sua senha..." />
            </Field>
          </FieldGroup>
          <Button className="w-full" type="submit">
            Entrar
          </Button>
        </form>
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
