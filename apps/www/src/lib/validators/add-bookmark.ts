import { SelectBookmark } from "@/db/schema";
import { z } from "zod";

export const BookmarkSchema = z.object({
  url: z.string().min(1),
});

export const BookmarkEntrySchema = z.object({
  url: z.string().url(),
  name: z.string(),
  description: z.string().optional(),
  favicon: z.string().optional(),
  folderId: z.string().optional(),
  isStarred: z.boolean(),
});

export type Bookmark = z.infer<typeof BookmarkSchema>;
export type BookmarkEntry = z.infer<typeof BookmarkEntrySchema>;
export type BookmarkEntryWithId = BookmarkEntry & { id: string };
