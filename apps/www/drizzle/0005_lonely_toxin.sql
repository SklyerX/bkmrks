CREATE TYPE "public"."permission_role" AS ENUM('OWNER', 'EDITOR', 'VIEWER');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"folder_id" varchar(24) NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"role" "permission_role" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sections" DROP CONSTRAINT "sections_parent_id_sections_id_fk";
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'sections'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "sections" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "sections" ALTER COLUMN "id" SET DATA TYPE varchar(24)[];--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permissions" ADD CONSTRAINT "permissions_folder_id_sections_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permissions" ADD CONSTRAINT "permissions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sections" ADD CONSTRAINT "sections_parent_id_sections_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "bookmarks" DROP COLUMN IF EXISTS "order";--> statement-breakpoint
ALTER TABLE "sections" DROP COLUMN IF EXISTS "order";--> statement-breakpoint
ALTER TABLE "sections" DROP COLUMN IF EXISTS "emoji";