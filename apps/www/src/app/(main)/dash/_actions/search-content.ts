"use server";

import { auth } from "@/auth";
import { actionClient } from "@/states/safe-action";
import { db } from "@/db";
import { z } from "zod";

export const searchContentAction = actionClient
  .schema(z.object({ query: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session || !session.user) throw new Error("Not authenticated");

    const sections = await db.query.sections.findMany({
      where: (fields, { and, ilike, eq }) =>
        and(
          eq(fields.userId, session.user?.id as string),
          ilike(fields.name, `%${parsedInput.query}%`)
        ),
    });

    const bookmarks = await db.query.bookmarks.findMany({
      where: (fields, { and, eq, ilike }) =>
        and(
          eq(fields.userId, session.user?.id as string),
          ilike(fields.name, `%${parsedInput.query}%`)
        ),
    });

    console.log("Bookmarks:", bookmarks);
    console.log("Sections:", sections);

    return { sections, bookmarks };
  });
