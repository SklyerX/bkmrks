import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type React from "react";
import { db } from "@/db";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";
import { CommandMenu } from "@/components/command-menu";
import AddBookmarkModal from "./_components/add-bookmark-modal";
import { Toaster } from "@/components/ui/sonner";
import EditBookmarkModal from "./_components/edit-bookmark-modal";
import CreateFolderModal from "./_components/create-folder-modal";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session?.user) return redirect("/login");

  const favorites = await db.query.bookmarks.findMany({
    where: (fields, { eq, and }) =>
      and(
        eq(fields.isStarred, true),
        eq(fields.userId, session?.user?.id as string)
      ),
    limit: 15,
  });

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <main className="min-h-screen bg-background">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar favorites={favorites} user={session.user} />
        <SidebarInset>
          <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <NuqsAdapter>{children}</NuqsAdapter>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <CommandMenu />
      <AddBookmarkModal />
      <EditBookmarkModal />
      <CreateFolderModal />
      <Toaster />
    </main>
  );
}
