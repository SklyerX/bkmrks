"use server";

import { auth } from "@/auth";
import { actionClient } from "@/states/safe-action";
import { db } from "@/db";
import { sections } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  folderId: z.string().optional(),
});

export const createFolderAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session || !session.user) throw new Error("Not authenticated");

    await db.insert(sections).values({
      userId: session.user.id,
      name: parsedInput.name,
      parentId: parsedInput.folderId || null,
    });

    parsedInput.folderId
      ? revalidatePath(`/dash/s/${parsedInput.folderId}`)
      : revalidatePath("/dash");
  });
