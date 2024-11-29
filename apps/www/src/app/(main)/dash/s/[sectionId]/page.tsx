import AddBookmark from "../../_components/add-bookmark";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/db";
import { bookmarks as bookmarksTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Folder } from "lucide-react";
import BookmarkCard from "../../_components/bookmark-card";
import { redirect } from "next/navigation";
import CreateFolder from "../../_components/create-folder";
import GoBack from "@/components/go-back";
import { SettingsDialog } from "@/components/settings-dialog";
import { FolderPermissionService } from "@/utils/folder-permission-service";

interface Props {
  params: {
    sectionId: string;
  };
}
export default async function Page(props: Props) {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const folderPermissions = new FolderPermissionService();

  const userId = session.user.id;
  const folderId = props.params.sectionId;

  const access = await folderPermissions.getFolderAccess(folderId, userId);
  if (!access.canRead) return redirect("/dash");

  const [currentSection, bookmarks, sections] = await Promise.all([
    db.query.sections.findFirst({
      where: (fields, { eq }) => eq(fields.id, folderId),
    }),

    db
      .select()
      .from(bookmarksTable)
      .where(eq(bookmarksTable.folderId, folderId))
      .orderBy(desc(bookmarksTable.createdAt)),

    db.query.sections.findMany({
      where: (fields, { eq }) => eq(fields.parentId, folderId),
      orderBy: (fields, { desc }) => desc(fields.id),
    }),
  ]);

  if (!currentSection) return redirect("/dash");

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GoBack />
          <h3 className="text-2xl font-semibold">
            {currentSection.name}
            {currentSection.userId !== userId && (
              <span className="ml-2 text-sm text-muted-foreground">
                (Shared)
              </span>
            )}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {access.canWrite && (
            <>
              <AddBookmark />
              <CreateFolder />
            </>
          )}
          {access.isOwner && <SettingsDialog />}
        </div>
      </div>
      <div className="mt-5 py-5 border-y">
        {sections.map((section) => (
          <Link
            href={`/dash/s/${section.id}`}
            key={section.id}
            className="flex items-center gap-2"
          >
            <Folder className="size-6" />
            <span>{section.name}</span>
          </Link>
        ))}
      </div>
      <div className="mt-5 space-y-4">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            bookmark={bookmark}
            key={bookmark.id}
            canEdit={access.canWrite}
          />
        ))}
      </div>
    </div>
  );
}
