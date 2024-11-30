"use server";

import { auth } from "@/auth";
import { actionClient } from "@/states/safe-action";
import { z } from "zod";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { bookmarks } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const schema = z.object({
  id: z.string(),
});

export const unfaviouriteBookmarkAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session || !session.user) throw new Error("Not authenticated");

    await db
      .update(bookmarks)
      .set({
        isStarred: false,
      })
      .where(
        and(
          eq(bookmarks.userId, session.user.id as string),
          eq(bookmarks.id, parsedInput.id)
        )
      );

    revalidatePath("/dash");
  });
