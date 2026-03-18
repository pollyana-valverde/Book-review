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

import { SearchIcon } from "lucide-react";

function SearchSection() {
  return (
    <form className="flex flex-col md:flex-row gap-3">
      <Field className="flex-1">
        <InputGroup>
          <InputGroupInput
            id="inline-start-input"
            placeholder="Search for a book..."
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Select>
        <SelectTrigger className="w-full max-w-56">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            <SelectItem value="fiction">Fiction</SelectItem>
            <SelectItem value="non-fiction">Non-Fiction</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="history">History</SelectItem>
            <SelectItem value="biography">Biography</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </form>
  );
}

export { SearchSection };
