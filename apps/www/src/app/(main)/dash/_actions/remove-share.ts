"use server";

import { auth } from "@/auth";
import { actionClient } from "@/states/safe-action";
import { z } from "zod";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { permissions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { FolderPermissionService } from "@/utils/folder-permission-service";

const schema = z.object({
  targetId: z.string(),
  folderId: z.string(),
});

export const removeShareAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session || !session.user) throw new Error("Not authenticated");

    const folderPermissions = new FolderPermissionService();

    const hasPermission = await folderPermissions.getFolderAccess(
      parsedInput.folderId,
      session.user.id as string
    );

    if (!hasPermission.isOwner)
      throw new Error("You do not have permission to remove this person");

    await db
      .delete(permissions)
      .where(
        and(
          eq(permissions.userId, parsedInput.targetId),
          eq(permissions.folderId, parsedInput.folderId)
        )
      );

    revalidatePath(`/dash/s/${parsedInput.folderId}`);
  });
