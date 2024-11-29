"use server";

import { auth } from "@/auth";
import { BookmarkEntrySchema } from "@/lib/validators/add-bookmark";
import { actionClient } from "@/states/safe-action";
import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { FolderPermissionService } from "@/utils/folder-permission-service";

export const addBookmarkAction = actionClient
  .schema(BookmarkEntrySchema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session || !session.user) throw new Error("Not authenticated");

    const folderPermissions = new FolderPermissionService();

    if (parsedInput.folderId) {
      const { canWrite } = await folderPermissions.getFolderAccess(
        parsedInput.folderId,
        session.user.id as string
      );

      if (!canWrite)
        throw new Error("You do not have permission to share this folder");
    }

    await db.insert(bookmarks).values({
      userId: session.user.id,
      name: parsedInput.name,
      url: parsedInput.url,
      description: parsedInput.description,
      isStarred: parsedInput.isStarred,
      folderId: parsedInput.folderId || null,
      favicon: parsedInput.favicon,
    });

    parsedInput.folderId
      ? revalidatePath(`/dash/s/${parsedInput.folderId}`)
      : revalidatePath("/dash");
  });
