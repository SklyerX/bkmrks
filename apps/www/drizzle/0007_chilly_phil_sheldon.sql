ALTER TABLE "bookmarks" ALTER COLUMN "id" SET DATA TYPE varchar(40);--> statement-breakpoint
ALTER TABLE "bookmarks" ALTER COLUMN "folder_id" SET DATA TYPE varchar(40);--> statement-breakpoint
ALTER TABLE "permissions" ALTER COLUMN "id" SET DATA TYPE varchar(40);--> statement-breakpoint
ALTER TABLE "permissions" ALTER COLUMN "folder_id" SET DATA TYPE varchar(40);--> statement-breakpoint
ALTER TABLE "permissions" ALTER COLUMN "user_id" SET DATA TYPE varchar(40);--> statement-breakpoint
ALTER TABLE "permissions" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sections" ALTER COLUMN "id" SET DATA TYPE varchar(40);--> statement-breakpoint
ALTER TABLE "sections" ALTER COLUMN "parent_id" SET DATA TYPE varchar(40);--> statement-breakpoint
ALTER TABLE "sections" ALTER COLUMN "subSections" SET DATA TYPE varchar(40)[];--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_user_id_folder_id_unique" UNIQUE("user_id","folder_id");