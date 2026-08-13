import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="bg-muted text-muted-foreground rounded-full p-3">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <Text as="h2" variant="heading-3">
          {title}
        </Text>
        <Text as="p" className="text-muted-foreground max-w-sm">
          {description}
        </Text>
      </div>
      {action && (
        <Button asChild size="sm">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
