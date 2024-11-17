// ADD COMMAND K PLUS SHORTCUTS TO EXECUTE ACTIONS

import { auth } from "@/auth";
import { db } from "@/db";
import { Folder } from "lucide-react";
import Link from "next/link";
import AddBookmark from "./_components/add-bookmark";
import BookmarkCard from "./_components/bookmark-card";
import { and, desc, eq, isNull } from "drizzle-orm";
import { bookmarks as bookmarksTable } from "@/db/schema";

export default async function Page() {
  const session = await auth();

  const [bookmarks, sections] = await Promise.all([
    await db
      .select()
      .from(bookmarksTable)
      .where(
        and(
          isNull(bookmarksTable.folderId),
          eq(bookmarksTable.userId, session?.user?.id as string)
        )
      )
      .orderBy(desc(bookmarksTable.createdAt)),
    db.query.sections.findMany({
      where: (fields, { eq, and, isNull }) =>
        and(
          isNull(fields.parentId),
          eq(fields.userId, session?.user?.id as string)
        ),
      orderBy: (fields, { desc }) => desc(fields.id),
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Root</h3>
        <AddBookmark />
      </div>
      <div className="mt-5 py-5 border-y">
        {sections.map((section) => (
          <Link
            href={`/s/${section.id}`}
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
          <BookmarkCard bookmark={bookmark} key={bookmark.id} />
        ))}
      </div>
    </div>
  );
}

// const session = await auth();

// // Fetch data
// const [starred, bookmarks, sections] = await Promise.all([
//   db.query.bookmarks.findMany({
//     where: (fields, { eq, and }) =>
//       and(
//         eq(fields.userId, session?.user?.id as string),
//         eq(fields.isStarred, true)
//       ),
//     limit: 5,
//   }),
//   db.query.bookmarks.findMany({
//     where: (fields, { eq, and, isNull }) =>
//       and(
//         isNull(fields.folderId),
//         eq(fields.userId, session?.user?.id as string)
//       ),
//     limit: 20,
//   }),
//   db.query.sections.findMany({
//     where: (fields, { eq, and, isNull }) =>
//       and(
//         isNull(fields.parentId),
//         eq(fields.userId, session?.user?.id as string)
//       ),
//     with: {
//       children: true,
//       bookmarks: true,
//     },
//   }),
// ]);
