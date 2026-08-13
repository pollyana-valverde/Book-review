"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  replaceWithParams,
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

import { CircleXIcon, Loader2Icon, SearchIcon } from "lucide-react";

const SEARCH_DEBOUNCE_MS = 300;

function SearchSection({ collections }: { collections: CollectionDTO[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQueryTitle = searchParams.get("title") || "";
  const searchQueryCollection = searchParams.get("collection") || "";

  const [isPending, startTransition] = useTransition();
  const [hasQuery, setHasQuery] = useState(!!searchQueryTitle);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sem timeout pendente ao desmontar, senão uma navegação dispara depois
  // do componente já ter saído da tela.
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const applyTitleFilter = useCallback(
    (title: string) => {
      const newQuery = new URLSearchParams(searchParams.toString());
      setOrDeleteParam(newQuery, "title", title);

      startTransition(() => {
        replaceWithParams(router, pathname, newQuery);
      });
    },
    [pathname, router, searchParams]
  );

  const handleQueryTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setHasQuery(!!value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      applyTitleFilter(value);
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Enter no formulário aplica na hora, sem esperar o debounce.
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    applyTitleFilter(inputRef.current?.value ?? "");
  };

  const handleQueryCollectionChange = (selectedCollection: CollectionDTO["id"]) => {
    const newQuery = new URLSearchParams(searchParams.toString());
    setOrDeleteParam(newQuery, "collection", selectedCollection);

    startTransition(() => {
      replaceWithParams(router, pathname, newQuery);
    });
  };

  const resetSearch = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setHasQuery(false);

    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
      <Field className="flex-1">
        <InputGroup>
          <InputGroupInput
            ref={inputRef}
            defaultValue={searchQueryTitle}
            onChange={handleQueryTitleChange}
            id="inline-start-input"
            placeholder="Buscar um livro..."
          />
          <InputGroupAddon align="inline-start">
            {isPending ? (
              <Loader2Icon className="text-muted-foreground animate-spin" />
            ) : (
              <SearchIcon className="text-muted-foreground" />
            )}
          </InputGroupAddon>

          {hasQuery && (
            <InputGroupAddon
              align="inline-end"
              onClick={resetSearch}
              className="cursor-pointer"
            >
              <CircleXIcon aria-label="Limpar busca" />
            </InputGroupAddon>
          )}
        </InputGroup>
      </Field>

      <Select
        onValueChange={handleQueryCollectionChange}
        value={searchQueryCollection || "all"}
      >
        <SelectTrigger className="w-full md:max-w-56">
          <SelectValue placeholder="Selecione uma coleção" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Coleções</SelectLabel>
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
