"use server";

import { auth } from "@/auth";
import { actionClient } from "@/states/safe-action";
import { z } from "zod";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { permissions, sections } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const schema = z.object({
  folderId: z.string(),
});

export const leaveShareAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");

    const folder = await db.query.sections.findFirst({
      where: eq(sections.id, parsedInput.folderId),
    });

    if (!folder) {
      throw new Error("Folder not found");
    }

    if (folder.userId === session.user.id) {
      throw new Error("Cannot leave a folder you own");
    }

    const deleted = await db
      .delete(permissions)
      .where(
        and(
          eq(permissions.userId, session.user.id),
          eq(permissions.folderId, parsedInput.folderId)
        )
      )
      .returning();

    if (!deleted.length) {
      throw new Error("You don't have access to this folder");
    }

    revalidatePath("/dash/shares");
    return { success: true };
  });
