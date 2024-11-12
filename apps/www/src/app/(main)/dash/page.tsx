// ADD COMMAND K PLUS SHORTCUTS TO EXECUTE ACTIONS

import { cookies } from "next/headers";

export default async function Page() {
  return <div className="container max-w-3xl mx-auto mt-8 space-y-20"></div>;
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
