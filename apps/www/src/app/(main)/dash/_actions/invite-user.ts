"use server";

import { auth } from "@/auth";
import { actionClient } from "@/states/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { FolderPermissionService } from "@/utils/folder-permission-service";
import { permissionRole } from "@/db/schema";
import { db } from "@/db";

const schema = z.object({
  targetEmail: z.string(),
  folderId: z.string(),
  role: z.enum(permissionRole.enumValues),
});

export const inviteUserAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session || !session.user) throw new Error("Not authenticated");

    const folderPermissions = new FolderPermissionService();

    const targetUser = await db.query.users.findFirst({
      where: (fields, { eq }) => eq(fields.email, parsedInput.targetEmail),
    });

    if (!targetUser) throw new Error("Invalid user");

    if (targetUser.id === session.user.id) {
      throw new Error("Cannot invite yourself");
    }

    const existingPermission = await db.query.permissions.findFirst({
      where: (fields, { and, eq }) =>
        and(
          eq(fields.userId, targetUser.id),
          eq(fields.folderId, parsedInput.folderId)
        ),
    });

    if (existingPermission)
      throw new Error("User already has access to this folder");

    if (parsedInput.role === "OWNER")
      throw new Error("Only you can be an owner");

    const { isOwner } = await folderPermissions.getFolderAccess(
      parsedInput.folderId,
      targetUser.id
    );

    if (!isOwner)
      throw new Error("You do not have permission to share this folder");

    await folderPermissions.shareFolder(
      parsedInput.folderId,
      targetUser.id,
      parsedInput.role
    );

    revalidatePath(`/dash/s/${parsedInput.folderId}`);
  });
