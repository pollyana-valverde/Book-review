import { Card } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className={`
     bg-[url('/sign-background.svg')]
     bg-cover bg-center bg-no-repeat h-screen
     p-4 flex justify-center items-center
    `}
    >
      <Card className="min-w-md">{children}</Card>
    </main>
  );
}
