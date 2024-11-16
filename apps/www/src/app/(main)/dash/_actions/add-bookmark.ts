"use server";

import { auth } from "@/auth";
import { BookmarkEntrySchema } from "@/lib/validators/add-bookmark";
import { actionClient } from "@/states/safe-action";
import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const addBookmarkAction = actionClient
  .schema(BookmarkEntrySchema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session || !session.user) throw new Error("Not authenticated");

    await db.insert(bookmarks).values({
      userId: session.user.id,
      name: parsedInput.name,
      url: parsedInput.url,
      description: parsedInput.description,
      isStarred: parsedInput.isStarred,
      folderId: parsedInput.folderId || null,
      favicon: parsedInput.favicon,
      order: 0,
    });

    parsedInput.folderId
      ? revalidatePath(`/dash/s/${parsedInput.folderId}`)
      : revalidatePath("/dash");
  });
