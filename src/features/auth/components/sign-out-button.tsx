"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/features/auth/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

function SignOutButton({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={className}
      title={title}
      onClick={handleSignOut}
    >
      <LogOutIcon className="w-4 h-4" />
      Sair
    </Button>
  );
}

export { SignOutButton };
