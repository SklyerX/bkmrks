import { type permissionRole, permissions, sections, users } from "@/db/schema";
import { and, eq, sql, inArray } from "drizzle-orm";
import { db } from "@/db";
import { createId } from "@paralleldrive/cuid2";

export class FolderPermissionService {
  async hasPermission(
    folderId: string,
    userId: string,
    requiredRole: (typeof permissionRole.enumValues)[number]
  ): Promise<boolean> {
    // First get the folder to check its path
    const folder = await db.query.sections.findFirst({
      where: eq(sections.id, folderId),
    });

    if (!folder) return false;

    const [highestPerm] = await db
      .select()
      .from(permissions)
      .where(
        and(
          eq(permissions.userId, userId),
          inArray(permissions.folderId, folder.subSections)
        )
      )
      .orderBy(
        sql`CASE role 
        WHEN 'OWNER' THEN 3 
        WHEN 'EDITOR' THEN 2 
        WHEN 'VIEWER' THEN 1 
      END DESC`
      )
      .limit(1);

    if (!highestPerm) return false;

    const roleHierarchy = {
      OWNER: 3,
      EDITOR: 2,
      VIEWER: 1,
    };

    return roleHierarchy[highestPerm.role] >= roleHierarchy[requiredRole];
  }

  async createFolder(name: string, parentId: string | null, ownerId: string) {
    const parent = parentId
      ? await db.query.sections.findFirst({
          where: eq(sections.id, parentId),
        })
      : null;

    const newFolderId = createId();
    const path = parent ? [...parent.subSections, newFolderId] : [newFolderId];

    return await db
      .insert(sections)
      .values({
        userId: ownerId,
        name,
        parentId: parentId,
        subSections: path,
      })
      .returning();
  }

  async getSharedFolders(userId: string) {
    return await db
      .select({
        folder: sections,
        permission: permissions,
      })
      .from(permissions)
      .innerJoin(sections, eq(sections.id, permissions.folderId))
      .where(eq(permissions.userId, userId));
  }

  async shareFolder(
    folderId: string,
    targetUser: string,
    accessRole: (typeof permissionRole.enumValues)[number]
  ) {
    if (accessRole === "OWNER")
      throw new Error("Cannot make someone an owner!");

    const folder = await db.query.sections.findFirst({
      where: eq(sections.id, folderId),
    });

    if (!folder) throw new Error("No folder found");

    const user = await db.query.users.findFirst({
      where: eq(users.id, targetUser),
    });

    if (!user) throw new Error("No user found");

    if (user.id === targetUser) throw new Error("Cannot share with yourself");

    await db.transaction(async (tx) => {
      await tx
        .insert(permissions)
        .values({
          userId: targetUser,
          folderId,
          role: accessRole,
        })
        .onConflictDoUpdate({
          target: [permissions.userId, permissions.folderId],
          set: {
            role: accessRole,
          },
        });

      for (const folderPathId of folder.subSections) {
        if (folderPathId === folderId) continue;

        await tx
          .insert(permissions)
          .values({
            userId: targetUser,
            folderId: folderPathId,
            role: accessRole,
          })
          .onConflictDoUpdate({
            target: [permissions.userId, permissions.folderId],
            set: {
              role: accessRole,
            },
          });
      }
    });
  }
}
