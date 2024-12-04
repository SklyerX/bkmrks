"use server";

import { auth } from "@/auth";
import { actionClient } from "@/states/safe-action";
import { z } from "zod";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { sections } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { FolderPermissionService } from "@/utils/folder-permission-service";

const schema = z.object({
  id: z.string(),
});

export const deleteFolderAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session || !session.user) throw new Error("Not authenticated");

    const folderPermissions = new FolderPermissionService();

    const { isOwner } = await folderPermissions.getFolderAccess(
      parsedInput.id,
      session.user.id as string
    );

    if (!isOwner)
      throw new Error("You do not have permission to share this folder");

    await db
      .delete(sections)
      .where(
        and(
          eq(sections.userId, session.user.id as string),
          eq(sections.id, parsedInput.id)
        )
      );

    revalidatePath("/dash");

    return "Folder deleted successfully!";
  });
