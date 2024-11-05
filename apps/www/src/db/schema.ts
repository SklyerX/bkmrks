import { varchar } from "drizzle-orm/pg-core";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

// REST OF DB

type FolderReference = { id: string };

export const folders = pgTable("folders", {
  id: varchar("id", { length: 24 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 50 }).notNull(),
  // ! LEAVE UNTIL END
  order: integer("order").notNull(), // For drag-and-drop reordering
  // ! LEAVE UNTIL END
  emoji: varchar("emoji", { length: 50 }).notNull(),
  parentId: varchar("parent_id", { length: 24 }).references(
    (): FolderReference => folders.id
  ),
});

export const bookmarks = pgTable("bookmarks", {
  id: varchar("id", { length: 24 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 50 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  description: varchar("description", { length: 500 }),
  favicon: text("favicon"),
  // ! LEAVE UNTIL END
  order: integer("order").notNull(),
  // ! LEAVE UNTIL END
  folderId: varchar("folder_id", { length: 24 }).references(() => folders.id, {
    onDelete: "cascade",
  }),
  isStarred: boolean("is_starred").notNull().default(false),
});

// Define relations for better type safety and querying
export const foldersRelations = relations(folders, ({ one, many }) => ({
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
  }),
  children: many(folders),
  bookmarks: many(bookmarks),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  folder: one(folders, {
    fields: [bookmarks.folderId],
    references: [folders.id],
  }),
}));
