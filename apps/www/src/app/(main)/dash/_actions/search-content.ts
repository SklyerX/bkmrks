"use server";

import { auth } from "@/auth";
import { actionClient } from "@/states/safe-action";
import { z } from "zod";
import { db } from "@/db";
import { bookmarks, sections } from "@/db/schema";
import { and, eq, ilike, or, desc } from "drizzle-orm";

const schema = z.object({
  query: z.string(),
  searchType: z.enum(["bookmarks", "folders", "all"]),
});

export const searchContentAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { query, searchType } }) => {
    const session = await auth();
    if (!session || !session.user) throw new Error("Not authenticated");

    const userId = session.user.id as string;

    if (searchType === "folders") {
      const sectionResults = await db
        .select()
        .from(sections)
        .where(
          and(eq(sections.userId, userId), ilike(sections.name, `%${query}%`))
        )
        .orderBy(desc(sections.createdAt))
        .limit(50);

      return {
        sections: sectionResults,
        bookmarks: [],
      };
    }

    if (searchType === "bookmarks") {
      const bookmarkResults = await db
        .select()
        .from(bookmarks)
        .where(
          and(
            eq(bookmarks.userId, userId),
            or(
              ilike(bookmarks.name, `%${query}%`),
              ilike(bookmarks.url, `%${query}%`)
            )
          )
        )
        .orderBy(desc(bookmarks.createdAt))
        .limit(50);

      return {
        sections: [],
        bookmarks: bookmarkResults,
      };
    }

    const sectionResults = await db
      .select()
      .from(sections)
      .where(
        and(eq(sections.userId, userId), ilike(sections.name, `%${query}%`))
      )
      .orderBy(desc(sections.createdAt))
      .limit(25);

    const bookmarkResults = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          or(
            ilike(bookmarks.name, `%${query}%`),
            ilike(bookmarks.url, `%${query}%`)
          )
        )
      )
      .orderBy(desc(bookmarks.createdAt))
      .limit(25);

    return {
      sections: sectionResults,
      bookmarks: bookmarkResults,
    };
  });
