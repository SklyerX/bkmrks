"use server";

import { auth } from "@/auth";
import { BookmarkEntrySchema } from "@/lib/validators/add-bookmark";
import { actionClient } from "@/states/safe-action";
import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

export const updateBookmarkAction = actionClient
  .schema(BookmarkEntrySchema.extend({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session || !session.user) throw new Error("Not authenticated");

    await db
      .update(bookmarks)
      .set({
        userId: session.user.id,
        folderId: parsedInput.folderId || null,
        name: parsedInput.name,
        url: parsedInput.url,
        description: parsedInput.description,
        isStarred: parsedInput.isStarred,
        favicon: parsedInput.favicon,
        order: 0,
      })
      .where(
        and(
          eq(bookmarks.userId, session.user.id as string),
          eq(bookmarks.id, parsedInput.id)
        )
      );

    parsedInput.folderId
      ? revalidatePath(`/dash/s/${parsedInput.folderId}`)
      : revalidatePath("/dash");
  });
