"use server";

import { auth } from "@/auth";
import { actionClient } from "@/states/safe-action";
import { db } from "@/db";
import { sections } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { FolderPermissionService } from "@/utils/folder-permission-service";

export const renameFolderAction = actionClient
  .schema(
    z.object({
      id: z.string(),
      name: z.string().min(1).max(50),
    })
  )
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session || !session.user) throw new Error("Not authenticated");

    const folderPermissions = new FolderPermissionService();

    if (parsedInput.id) {
      const { canWrite } = await folderPermissions.getFolderAccess(
        parsedInput.id,
        session.user.id as string
      );

      if (!canWrite)
        throw new Error("You do not have permission to share this folder");
    }

    await db
      .update(sections)
      .set({
        userId: session.user.id,
        name: parsedInput.name,
      })
      .where(
        and(
          eq(sections.userId, session.user.id as string),
          eq(sections.id, parsedInput.id)
        )
      );

    revalidatePath(`/dash/s/${parsedInput.id}`);
  });
