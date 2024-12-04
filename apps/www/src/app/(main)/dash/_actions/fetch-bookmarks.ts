"use server";
import { auth } from "@/auth";
import { actionClient } from "@/states/safe-action";
import { z } from "zod";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { bookmarks as bookmarksSchema } from "@/db/schema";

export const fetchBookmarksAction = actionClient
  .schema(
    z.object({
      page: z.number().optional().default(1),
      limit: z.number().optional().default(20),
    })
  )
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session || !session.user) throw new Error("Not authenticated");

    const { page, limit } = parsedInput;
    const skip = (page - 1) * limit;

    const count = await db.$count(
      bookmarksSchema,
      eq(bookmarksSchema.userId, session.user.id as string)
    );

    const bookmarks = await db.query.bookmarks.findMany({
      offset: skip,
      limit,
      where: (fields, { eq }) => eq(fields.userId, session.user?.id as string),
      orderBy: (fields, { desc }) => desc(fields.createdAt),
    });

    console.log(bookmarks, count);

    return {
      bookmarks,
      metadata: {
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
      },
    };
  });
