import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { sections } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { config } from "dotenv";

config();

const db = drizzle(process.env.DATABASE_URL as string, { schema });

async function buildPathForFolder(folderId: string): Promise<string[]> {
  const folder = await db.query.sections.findFirst({
    where: eq(sections.id, folderId),
  });

  if (!folder) return [folderId];

  let path = [folderId];
  const children = await db.query.sections.findMany({
    where: eq(sections.parentId, folderId),
  });

  for (const child of children) {
    const childPath = await buildPathForFolder(child.id);
    path = [...path, ...childPath];
  }

  return path;
}

async function populateSubSections() {
  const allSections = await db.select().from(sections);

  for (const section of allSections) {
    const path = await buildPathForFolder(section.id);
    await db
      .update(sections)
      .set({ subSections: path })
      .where(eq(sections.id, section.id));
  }
}

(async () => {
  // Run migrations first
  await migrate(db, { migrationsFolder: "./drizzle" });

  // // Then populate subSections data
  // await populateSubSections();
})();
