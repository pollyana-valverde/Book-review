"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  pushWithParams,
  setOrDeleteParam,
} from "@/template/books-review-page/lib";
import type { CollectionDTO } from "@/server/modules/collections/collection.contract";

import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CircleXIcon, SearchIcon } from "lucide-react";

function SearchSection({ collections }: { collections: CollectionDTO[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQueryTitle = searchParams.get("title") || "";
  const searchQueryCollection = searchParams.get("collection") || "";

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLFormElement>) => {
      event.preventDefault();

      const newQuery = new URLSearchParams(searchParams.toString());

      setOrDeleteParam(newQuery, "title", searchQueryTitle);
      setOrDeleteParam(newQuery, "collection", searchQueryCollection);

      pushWithParams(router, pathname, newQuery);
    },
    [pathname, router, searchParams, searchQueryCollection, searchQueryTitle]
  );

  const handleQueryTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuery = new URLSearchParams(searchParams.toString());
    const queryTitle = event.target.value;

    setOrDeleteParam(newQuery, "title", queryTitle);

    pushWithParams(router, pathname, newQuery);
  };

  const handleQueryCollectionChange = (selectedCollection: CollectionDTO["id"]) => {
    const newQuery = new URLSearchParams(searchParams.toString());

    setOrDeleteParam(newQuery, "collection", selectedCollection);

    pushWithParams(router, pathname, newQuery);
  };

  const resetSearch = () => {
    router.push(pathname, {
      scroll: false,
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
      <Field className="flex-1">
        <InputGroup>
          <InputGroupInput
            value={searchQueryTitle}
            onChange={handleQueryTitleChange}
            id="inline-start-input"
            placeholder="Search for a book..."
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>

          {searchQueryTitle && (
            <InputGroupAddon
              align="inline-end"
              onClick={resetSearch}
              className="cursor-pointer"
            >
              <CircleXIcon />
            </InputGroupAddon>
          )}
        </InputGroup>
      </Field>

      <Select
        onValueChange={handleQueryCollectionChange}
        value={searchQueryCollection || "all"}
      >
        <SelectTrigger className="w-full md:max-w-56">
          <SelectValue placeholder="Select a collection" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Collections</SelectLabel>
            <SelectItem value="all">Todas</SelectItem>
            {collections.map((collection) => (
              <SelectItem key={collection.id} value={collection.id}>
                {collection.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </form>
  );
}

export { SearchSection };
