'use client'
import { SearchIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

export default function SearchBar() {
    const [search, setSearch] = useState<string>("")

    const router = useRouter()

    const onSearch = () => {
        const searchValue = search.trim()
        if (!searchValue) return
        const params = new URLSearchParams()
        params.set("search", searchValue)
        router.push(`/?${params.toString()}`)
    }

    return (
        <InputGroup className="max-w-sm">
            <InputGroupInput
                placeholder="Search..."
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onSearch()
                    }
                }}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                
            />
            <InputGroupAddon>
                <SearchIcon className="text-muted-foreground" />
            </InputGroupAddon>
            {!!search && (
                <InputGroupAddon align="inline-end">
                    <Button variant={"outline"} size={"icon-xs"} onClick={() => {
                        setSearch("")
                    }}><X /></Button>
                </InputGroupAddon>
            )}
        </InputGroup>
    )
}