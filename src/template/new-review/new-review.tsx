import { getAlbums } from "@/server/modules/albums/album.queries";
import { getSession } from "@/server/auth/session";

import { Text } from "@/components/ui/text";
import { NewReviewForm } from "@/template/new-review/components/new-review-form";

import { BookOpenIcon } from "lucide-react";

async function NewReviewPage() {
  const { user } = (await getSession())!;
  const albums = await getAlbums(user.id);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex gap-4 items-center">
        <div className="bg-secondary text-secondary-foreground rounded-xl p-3">
          <BookOpenIcon className="w-7 h-7" />
        </div>
        <div>
          <Text as="h1" variant="heading-1">
            Nova Resenha
          </Text>
          <Text as="p" className="text-muted-foreground">
            Compartilhe sua opinião sobre um livro
          </Text>
        </div>
      </div>

      <NewReviewForm albumsList={albums} />
    </div>
  );
}

export { NewReviewPage };
