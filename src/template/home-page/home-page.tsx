import { Text } from "@/components/ui/text";

function HomePage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Text as="h1" variant="heading-1">
          Dashboard
        </Text>
        <Text as="p" className="text-muted-foreground">
          Visão geral das suas resenhas
        </Text>
      </div>
    </div>
  );
}

export { HomePage };
