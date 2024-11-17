"use server";

import { auth } from "@/auth";
import { actionClient } from "@/states/safe-action";
import { z } from "zod";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { sections } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const schema = z.object({
  id: z.string(),
});

export const deleteFolderAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session || !session.user) throw new Error("Not authenticated");

    console.log("IN DELETE FOLDER", parsedInput);

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
