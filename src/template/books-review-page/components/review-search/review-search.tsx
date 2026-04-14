"use client";

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
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

function SearchSection({ albums }: { albums: Album[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQueryTitle = searchParams.get("title") || "";
  const searchQueryCategory = searchParams.get("category") || "";

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (searchQueryTitle.trim()) {
        router.push(
          `/books-review?title=${encodeURIComponent(searchQueryTitle)}&&category=${encodeURIComponent(searchQueryCategory)}`
        );
      }
    },
    [router, searchQueryTitle, searchQueryCategory]
  );

  const handleQueryTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQueryTitle = event.target.value;

    router.push(
      `/books-review?title=${encodeURIComponent(newQueryTitle)}&&category=${encodeURIComponent(searchQueryCategory)}`,
      {
        scroll: false,
      }
    );
  };

  const handleQueryCategoryChange = (value: Album["id"]) => {
    router.push(
      `/books-review?title=${encodeURIComponent(searchQueryTitle)}&&category=${encodeURIComponent(value)}`,
      {
        scroll: false,
      }
    );

    if (value === ("all" as Album["id"])) {
      resetSearch();
    }
  };

  const resetSearch = () => {
    router.push("/books-review", {
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
        onValueChange={handleQueryCategoryChange}
        defaultValue={searchQueryCategory}
      >
        <SelectTrigger className="w-full md:max-w-56">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            <SelectItem value="all">Todas</SelectItem>
            {albums.map((album) => (
              <SelectItem key={album.id} value={album.id}>
                {album.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </form>
  );
}

export { SearchSection };
