import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Inbox } from "lucide-react";
import type { SelectBookmark } from "@/db/schema";
import type { User } from "next-auth";
import NavFavorites from "./nav-favorites";
import NavUser from "./nav-user";

// This is sample data.
const data = {
  navMain: [
    {
      title: "All",
      url: "/dash/all",
      icon: Inbox,
    },
  ],
};

interface Props extends React.ComponentProps<typeof Sidebar> {
  favorites: (typeof SelectBookmark)[];
  user: User;
}

export function AppSidebar({ user, favorites, ...props }: Props) {
  return (
    <Sidebar {...props}>
      <SidebarContent className="gap-0">
        <SidebarHeader>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarHeader>
        <NavFavorites favorites={favorites} />
        <NavUser user={user} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
