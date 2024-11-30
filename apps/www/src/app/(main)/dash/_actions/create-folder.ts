"use server";

import { auth } from "@/auth";
import { actionClient } from "@/states/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { FolderPermissionService } from "@/utils/folder-permission-service";

const schema = z.object({
  name: z.string(),
  folderId: z.string().optional(),
});

export const createFolderAction = actionClient
  .schema(schema)
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

    await folderPermissions.createFolder(
      parsedInput.name,
      parsedInput.folderId || null,
      session.user.id as string
    );

    parsedInput.folderId
      ? revalidatePath(`/dash/s/${parsedInput.folderId}`)
      : revalidatePath("/dash");
  });
