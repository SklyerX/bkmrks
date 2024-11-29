import { auth } from "@/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { db } from "@/db";
import { Eye, Folder, Pen, type LucideIcon } from "lucide-react";
import Link from "next/link";
import LeaveShare from "../_components/leave-share";
import { FolderPermissionService } from "@/utils/folder-permission-service";

// Define a type for non-owner roles
type NonOwnerRole = Exclude<"OWNER" | "EDITOR" | "VIEWER", "OWNER">;

const roleIcons: Record<NonOwnerRole, LucideIcon> = {
  VIEWER: Eye,
  EDITOR: Pen,
};

export default async function Page() {
  const session = await auth();

  const shares = await db.query.permissions.findMany({
    where: (fields, { eq, and, not }) =>
      and(
        eq(fields.userId, session?.user?.id as string),
        not(eq(fields.role, "OWNER"))
      ),
    orderBy: (fields, { desc }) => desc(fields.id),
    with: {
      section: true,
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full">
      <h3 className="text-2xl font-semibold">Shared with me</h3>
      <div className="mt-5">
        {shares.map((share) => {
          const Icon = roleIcons[share.role as NonOwnerRole];

          return (
            <div className="flex items-center gap-2" key={share.id}>
              <Link
                href={`/dash/s/${share.section.id}`}
                key={share.id}
                className="flex items-center gap-2 flex-1"
              >
                <Folder className="size-6" />
                <span>{share.section.name}</span>
              </Link>
              <div className="flex items-center gap-2">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Icon className="size-5" />
                    </TooltipTrigger>
                    <TooltipContent className="w-56">
                      {share.role.toLowerCase()}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <LeaveShare id={share.id} />
              </div>
            </div>
          );
        })}
        <pre>
          <code>{JSON.stringify(shares, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}
