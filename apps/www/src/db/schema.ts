import { pgEnum, varchar } from "drizzle-orm/pg-core";
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

type FolderReference = { id: string };

export const sections = pgTable("sections", {
  id: varchar("id", { length: 24 })
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 50 }).notNull(),
  parentId: varchar("parent_id", { length: 24 }).references(
    (): FolderReference => sections.id,
    {
      onDelete: "cascade",
    }
  ),
  subSections: varchar("subSections", { length: 24 })
    .$defaultFn(() => createId())
    .array()
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
  id: varchar("id", { length: 24 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 150 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  userId: text("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  description: varchar("description", { length: 500 }),
  favicon: text("favicon"),
  folderId: varchar("folder_id", { length: 24 }).references(() => sections.id, {
    onDelete: "cascade",
  }),
  isStarred: boolean("is_starred").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const permissionRole = pgEnum("permission_role", [
  "OWNER",
  "EDITOR",
  "VIEWER",
]);

export const permissions = pgTable("permissions", {
  id: varchar("id", { length: 24 })
    .primaryKey()
    .$defaultFn(() => createId()),
  folderId: varchar("folder_id", { length: 24 })
    .references(() => sections.id, {
      onDelete: "cascade",
    })
    .notNull(),
  userId: varchar("user_id", { length: 24 })
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  role: permissionRole("role").notNull(),
});

// Combine all section relations into a single declaration with named relations
export const sectionRelations = relations(sections, ({ one, many }) => ({
  parent: one(sections, {
    fields: [sections.parentId],
    references: [sections.id],
    relationName: "parentChild",
  }),
  children: many(sections, {
    relationName: "parentChild",
  }),
  bookmarks: many(bookmarks),
  permissions: many(permissions),
}));

export const bookmarkRelations = relations(bookmarks, ({ one, many }) => ({
  folder: one(sections, {
    fields: [bookmarks.folderId],
    references: [sections.id],
  }),
  permissions: many(permissions),
}));

export const permissionRelations = relations(permissions, ({ one }) => ({
  section: one(sections, {
    fields: [permissions.folderId],
    references: [sections.id],
  }),
  user: one(users, {
    fields: [permissions.userId],
    references: [users.id],
  }),
}));

// Types

export const SelectBookmark = bookmarks.$inferSelect;
export const SelectSection = sections.$inferSelect;
