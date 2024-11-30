"use client";

import { Settings, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";
import ShareSettings from "./share-settings";
import AdvancedSettings from "./advanced-settings";

const data = {
  nav: [
    { name: "Share", icon: Share2, component: ShareSettings },
    { name: "Advanced", icon: Settings, component: AdvancedSettings },
  ],
};

export function SettingsDialog() {
  const [open, setOpen] = useQueryState(
    "settings",
    parseAsBoolean.withDefault(false)
  );

  const [currentRoute, setCurrentRoute] = useQueryState(
    "currentRoute",
    parseAsString.withDefault("Share")
  );

  const RouteComponent =
    data.nav.find((item) => item.name === currentRoute)?.component ||
    data.nav[0].component;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.name === currentRoute}
                        >
                          <button
                            type="button"
                            onClick={() => setCurrentRoute(item.name)}
                          >
                            <item.icon />
                            <span>{item.name}</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0 mt-5">
              <RouteComponent />
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
