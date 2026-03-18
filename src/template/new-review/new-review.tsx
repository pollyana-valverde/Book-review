import { Text } from "@/components/ui/text";

function NewReviewPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Text as="h1" variant="heading-1">
          Nova Resenha
        </Text>
        <Text as="p" className="text-muted-foreground">
          Adicione uma nova resenha de livro
        </Text>
      </div>
    </div>
  );
}

export { NewReviewPage };
