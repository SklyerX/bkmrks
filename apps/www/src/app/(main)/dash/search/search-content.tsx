"use client";

import { Input } from "@/components/ui/input";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Filter, Folder, SlidersVertical } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { searchContentAction } from "../_actions/search-content";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import BookmarkCard from "../_components/bookmark-card";

type SearchType = "bookmarks" | "folders" | "all";

export default function SearchContent() {
  const [filters, setFilters] = React.useState({
    showLinks: true,
    showFolders: false,
  });

  const { execute, status, result } = useAction(searchContentAction);

  const handleFilterChange = (key: keyof typeof filters, value: boolean) =>
    setFilters((filters) => ({ ...filters, [key]: value }));

  const getSearchType = (_filters: typeof filters): SearchType => {
    const { showLinks, showFolders } = _filters;

    if (showLinks && showFolders) return "all";
    if (showLinks) return "bookmarks";
    if (showFolders) return "folders";

    return "all";
  };

  const debounceQuery = useDebounce(async (value: string) => {
    const searchType = getSearchType(filters);
    execute({ query: value, searchType });
  }, 500);

  return (
    <div>
      <div className="flex items-center gap-2">
        <Input
          className="flex-1"
          placeholder="Title, urls, regex, names"
          disabled={status === "executing"}
          onChange={({ target }) => {
            if (target.value.length > 0) {
              debounceQuery(target.value);
            }
          }}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.showLinks}
              onCheckedChange={(checked) =>
                handleFilterChange("showLinks", checked)
              }
            >
              Links
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.showFolders}
              onCheckedChange={(checked) =>
                handleFilterChange("showFolders", checked)
              }
            >
              Folders
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-5 space-y-4">
        {result.data?.sections.map((section) => (
          <Link
            href={`/dash/s/${section.id}`}
            key={section.id}
            className="flex items-center gap-2"
          >
            <Folder className="size-6" />
            <span>{section.name}</span>
          </Link>
        ))}
        {result.data?.bookmarks.map((bookmark) => (
          <BookmarkCard bookmark={bookmark} key={bookmark.id} canEdit={true} />
        ))}
      </div>
    </div>
  );
}
