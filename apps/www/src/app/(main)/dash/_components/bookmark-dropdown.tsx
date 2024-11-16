"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SelectBookmark } from "@/db/schema";
import { Copy, Edit, ExternalLink, MoreVertical, Trash } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { deleteBookmarkAction } from "../_actions/delete-bookmart";
import { useParams } from "next/navigation";
import { useEditBookmark } from "@/states/edit-bookmark";

interface Props {
  bookmark: typeof SelectBookmark;
}

export default function BookmarkDropdown({ bookmark }: Props) {
  const { sectionId } = useParams();
  const { openDialog } = useEditBookmark();

  const handleCopy = () => {
    toast.promise(navigator.clipboard.writeText(bookmark.url), {
      loading: "Copying...",
      success: "Copied to clipboard",
      error: "Failed to copy to clipboard",
    });
  };

  const handleDelete = () => {
    toast.promise(
      deleteBookmarkAction({
        id: bookmark.id,
        folderId: Array.isArray(sectionId) ? sectionId[0] : sectionId || "",
      }),
      {
        loading: "Deleting...",
        success: "Bookmark deleted",
        error: "Failed to delete bookmark",
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          className="flex items-center"
          onClick={() => openDialog(bookmark)}
        >
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={bookmark.url}
            className="flex items-center"
            target="_blank"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>Open in new tab</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center" onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center text-red-600"
          onClick={handleDelete}
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
