"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CollectionForm } from "@/features/collections/components/collection-form";

import { PlusIcon } from "lucide-react";

function CollectionFormToggle() {
  const [openCollectionForm, setOpenCollectionForm] = useState(false);

  return (
    <>
      <Button
        className="md:absolute md:top-4 md:right-0 md:w-auto w-full"
        size="lg"
        onClick={() => setOpenCollectionForm(!openCollectionForm)}
      >
        <PlusIcon /> Nova Coleção
      </Button>

      {openCollectionForm && <CollectionForm />}
    </>
  );
}

export { CollectionFormToggle };
