import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon, X } from "lucide-react";
import { useSearchStore } from "./store";
import { useRouter, useSearchParams } from "next/navigation";
import { forwardRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type SearchInputProps = { classname?: string };

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ classname }, ref) => {
    const search = useSearchStore((state) => state.search);
    const setSearch = useSearchStore((state) => state.setSearch);

    const router = useRouter();

    const searchParams = useSearchParams();
    const keyword = searchParams.get("search") ?? "";

    useEffect(() => {
      if (keyword) {
        setSearch(keyword);
      }
    }, [keyword, setSearch]);

    const onSearch = () => {
      const searchValue = search.trim();
      if (!searchValue) return;
      const params = new URLSearchParams();
      params.set("search", searchValue);
      router.push(`/?${params.toString()}`);
    };

    return (
      <InputGroup className={cn("max-w-xs md:max-w-sm", classname)}>
        <InputGroupInput
          ref={ref}
          placeholder="Search..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="placeholder:text-sm placeholder:sm:text-base text-sm sm:text-base"
        />
        <InputGroupAddon>
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
        {!!search && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size={"icon-xs"}
              onClick={() => {
                setSearch("");
              }}
            >
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        )}
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant={"secondary"}
            onClick={() => {
              if (!search) return;
              onSearch();
            }}
          >
            Search
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    );
  },
);

SearchInput.displayName = "SearchInput";

export default SearchInput

