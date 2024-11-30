"use client";

import React, { useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Link, FolderPlus, Settings, FolderCog } from "lucide-react";
import { useCreateFolder } from "@/states/create-folder";
import { useAddBookmark } from "@/states/add-bookmark";
import { redirect, useParams } from "next/navigation";

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { sectionId } = useParams();
  const parsedSectionId = Array.isArray(sectionId) ? sectionId[0] : sectionId;

  const { setOpen: setBookmarkOpen } = useAddBookmark();
  const { setOpen: setFolderOpen } = useCreateFolder();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (action: string) => {
    switch (action) {
      case "add-link":
        setBookmarkOpen(true);
        setOpen(false);
        break;
      case "create-folder":
        setFolderOpen(true);
        setOpen(false);
        break;
      case "folder-settings":
        setOpen(false);
        if (sectionId)
          return redirect(`/dash/s/${parsedSectionId}?settings=true`);
        break;
      case "settings":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg shadow-md">
        <CommandInput
          placeholder="Type a command..."
          value={search}
          onValueChange={(value) => {
            setSearch(value);
          }}
        />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          <CommandGroup>
            <CommandItem
              onSelect={() => handleSelect("add-link")}
              className="flex items-center space-x-2 px-4 py-2"
            >
              <Link className="h-4 w-4" />
              <span>Add Link</span>
            </CommandItem>

            <CommandItem
              onSelect={() => handleSelect("create-folder")}
              className="flex items-center space-x-2 px-4 py-2"
            >
              <FolderPlus className="h-4 w-4" />
              <span>Create Folder</span>
            </CommandItem>

            <CommandItem
              onSelect={() => handleSelect("folder-settings")}
              className="flex items-center space-x-2 px-4 py-2"
            >
              <FolderCog className="h-4 w-4" />
              <span>Folder Settings</span>
            </CommandItem>

            <CommandItem
              onSelect={() => handleSelect("settings")}
              className="flex items-center space-x-2 px-4 py-2"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};
