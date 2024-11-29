import { type permissionRole, permissions, sections, users } from "@/db/schema";
import { and, eq, sql, inArray } from "drizzle-orm";
import { db } from "@/db";
import { createId } from "@paralleldrive/cuid2";

export interface FolderAccess {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  isOwner: boolean;
}

export class FolderPermissionService {
  async getFolderAccess(
    folderId: string,
    userId: string
  ): Promise<FolderAccess> {
    console.log("Debug - Input folderID:", folderId);
    console.log("Debug - Input folderID type:", typeof folderId);

    const folder = await db.query.sections.findFirst({
      where: (fields, { eq }) => eq(fields.id, folderId),
    });

    console.log("Debug - Query result:", folder);

    if (!folder) throw new Error("Invalid folder");

    if (folder.userId === userId) {
      return { canRead: true, canWrite: true, canDelete: true, isOwner: true };
    }

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

    console.log("Debug - Highest permission:", highestPerm);

    if (!highestPerm) {
      return {
        canRead: false,
        canWrite: false,
        canDelete: false,
        isOwner: false,
      };
    }

    switch (highestPerm.role) {
      case "EDITOR":
        return {
          canRead: true,
          canWrite: true,
          canDelete: true,
          isOwner: false,
        };
      case "VIEWER":
        return {
          canRead: true,
          canWrite: false,
          canDelete: false,
          isOwner: false,
        };
      default:
        return {
          canRead: false,
          canWrite: false,
          canDelete: false,
          isOwner: false,
        };
    }
  }

  async createFolder(name: string, parentId: string | null, ownerId: string) {
    const parent = parentId
      ? await db.query.sections.findFirst({
          where: eq(sections.id, parentId),
        })
      : null;

    const newFolderId = createId();
    const path = parent ? [...parent.subSections, newFolderId] : [newFolderId];

    console.log(name, parentId, ownerId);

    return await db.transaction(async (tx) => {
      const [section] = await tx
        .insert(sections)
        .values({
          id: newFolderId,
          userId: ownerId,
          name,
          parentId: parentId,
          subSections: path,
        })
        .returning();

      await tx.insert(permissions).values({
        userId: ownerId,
        folderId: newFolderId,
        role: "OWNER",
      });

      return section;
    });
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

    const existingPermissions = await db.query.permissions.findMany({
      where: and(
        eq(permissions.userId, targetUser),
        inArray(permissions.folderId, folder.subSections)
      ),
    });

    // If permissions exist, update them
    if (existingPermissions.length > 0) {
      await db
        .update(permissions)
        .set({ role: accessRole })
        .where(
          and(
            eq(permissions.userId, targetUser),
            inArray(permissions.folderId, folder.subSections)
          )
        );
      return;
    }

    // If no permissions exist, insert new ones
    const permissionsToInsert = folder.subSections.map((sectionId) => ({
      userId: targetUser,
      folderId: sectionId,
      role: accessRole,
    }));

    await db.insert(permissions).values(permissionsToInsert);
  }
}
