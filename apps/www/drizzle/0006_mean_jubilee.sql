ALTER TABLE "sections" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "sections" ALTER COLUMN "id" SET DATA TYPE varchar(24);--> statement-breakpoint
ALTER TABLE "sections" ADD COLUMN "subSections" varchar(24)[] NOT NULL;