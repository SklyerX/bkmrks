"use server";
import { auth } from "@/auth";
import { actionClient } from "@/states/safe-action";
import { db } from "@/db";
import { z } from "zod";
import { type permissionRole, permissions, users } from "@/db/schema";
import { and, eq, not } from "drizzle-orm";

export interface ShareReturnObject {
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  role: (typeof permissionRole.enumValues)[number];
}

export const fetchSharesAction = actionClient
  .schema(
    z.object({
      folderId: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session || !session.user) throw new Error("Not authenticated");

    const folder = await db.query.sections.findFirst({
      where: (fields, { eq }) => eq(fields.id, parsedInput.folderId),
    });

    const permission = await db.query.permissions.findFirst({
      where: (fields, { and, eq }) =>
        and(
          eq(fields.userId, session.user?.id as string),
          eq(fields.folderId, parsedInput.folderId)
        ),
    });

    if (!permission && (!folder || folder.userId !== session.user.id)) {
      throw new Error("Unauthorized access");
    }

    const shares = await db
      .select({
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
        role: permissions.role,
      })
      .from(permissions)
      .innerJoin(users, eq(users.id, permissions.userId))
      .where(
        and(
          eq(permissions.folderId, parsedInput.folderId),
          not(eq(permissions.role, "OWNER"))
        )
      );

    return shares;
  });
