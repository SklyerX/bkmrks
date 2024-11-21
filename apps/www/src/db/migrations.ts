// index.ts
import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const db = drizzle(env.DATABASE_URL);

await migrate(db, {
  migrationsFolder: "./drizzle",
});
