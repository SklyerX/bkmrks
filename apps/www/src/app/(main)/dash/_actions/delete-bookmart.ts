"use server";

import { auth } from "@/auth";
import { actionClient } from "@/states/safe-action";
import { z } from "zod";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { bookmarks } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { FolderPermissionService } from "@/utils/folder-permission-service";

const schema = z.object({
  id: z.string(),
  folderId: z.string().optional(),
});

export const deleteBookmarkAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session || !session.user) throw new Error("Not authenticated");

    const folderPermissions = new FolderPermissionService();

    if (parsedInput.folderId) {
      const { canDelete } = await folderPermissions.getFolderAccess(
        parsedInput.folderId,
        session.user.id as string
      );

      if (!canDelete)
        throw new Error("You do not have permission to share this folder");
    }

    await db
      .delete(bookmarks)
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
