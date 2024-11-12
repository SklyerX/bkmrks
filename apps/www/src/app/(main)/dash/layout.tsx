import { auth } from "@/auth";
import Sidebar from "@/components/sidebar";
import { redirect } from "next/navigation";
import type React from "react";
import { db } from "@/db";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session?.user) return redirect("/login");

  return (
    <main className="min-h-screen bg-background">
      {/* Global Header */}
      <header className="h-16 border-b flex items-center px-4">
        <div className="container max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="font-semibold">Bookmarks</h1>
          <div>user dropdown</div>
        </div>
      </header>

      {children}
    </main>
  );
}
