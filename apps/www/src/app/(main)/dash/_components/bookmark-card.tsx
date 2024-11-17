import type { SelectBookmark } from "@/db/schema";
import React from "react";
import BookmarkDropdown from "./bookmark-dropdown";

interface Props {
  bookmark: typeof SelectBookmark;
}

const truncateText = (text: string | null | undefined, maxLength: number) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export default function BookmarkCard({ bookmark }: Props) {
  const TITLE_MAX_LENGTH = 50;
  const DESCRIPTION_MAX_LENGTH = 103;

  const getDescription = () => {
    if (!bookmark.description) {
      return "No description";
    }
    return truncateText(bookmark.description, DESCRIPTION_MAX_LENGTH);
  };

  const title = truncateText(bookmark.name, TITLE_MAX_LENGTH);

  const iconUrl =
    bookmark.favicon ||
    `https://api.dicebear.com/9.x/glass/svg?seed=${bookmark.name}`;

  return (
    <div className="flex gap-2">
      <img
        src={iconUrl}
        alt={bookmark.name}
        className="size-12 rounded-md object-cover"
      />
      <div className="w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{title}</h3>
          <BookmarkDropdown bookmark={bookmark} />
        </div>
        <p className="text-sm text-muted-foreground">{getDescription()}</p>
      </div>
    </div>
  );
}
