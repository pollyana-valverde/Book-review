"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

function SearchSection({ albums }: { albums: Album[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQueryTitle = searchParams.get("title") || "";
  const searchQueryCategory = searchParams.get("category") || "";

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLFormElement>) => {
      event.preventDefault();

      const newQuery = new URLSearchParams(searchParams.toString());

      if (searchQueryTitle.trim()) {
        newQuery.set("title", searchQueryTitle);
      } else {
        newQuery.delete("title");
      }

      if (searchQueryCategory && searchQueryCategory !== "all") {
        newQuery.set("category", searchQueryCategory);
      } else {
        newQuery.delete("category");
      }

      const queryString = newQuery.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, router, searchParams, searchQueryCategory, searchQueryTitle]
  );

  const handleQueryTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuery = new URLSearchParams(searchParams.toString());
    const queryTitle = event.target.value;

    if (queryTitle.trim()) {
      newQuery.set("title", queryTitle);
    } else {
      newQuery.delete("title");
    }

    const queryString = newQuery.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleQueryCategoryChange = (selectedAlbum: Album["id"]) => {
    const newQuery = new URLSearchParams(searchParams.toString());

    if (selectedAlbum === ("all" as Album["id"])) {
      newQuery.delete("category");
    } else {
      newQuery.set("category", selectedAlbum);
    }

    const queryString = newQuery.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
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
        onValueChange={handleQueryCategoryChange}
        value={searchQueryCategory || "all"}
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
