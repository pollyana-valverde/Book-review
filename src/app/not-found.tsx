import Link from "next/link";
import { LayoutDashboardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen -m-20 flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-primary">404</h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Desculpe, a página que você está procurando não existe. Verifique o
            URL ou volte para a página inicial.
          </p>
        </div>

        <Button asChild size="lg">
          <Link href="/">
            <LayoutDashboardIcon size={20} />
            Voltar para Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
