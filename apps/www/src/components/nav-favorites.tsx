"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  ArrowUpRight,
  Link,
  MoreHorizontal,
  StarOff,
  Trash2,
} from "lucide-react";
import type { SelectBookmark } from "@/db/schema";
import { toast } from "sonner";
import { deleteBookmarkAction } from "@/app/(main)/dash/_actions/delete-bookmart";
import { unfaviouriteBookmarkAction } from "@/app/(main)/dash/_actions/unfavorite";

interface Props {
  favorites: (typeof SelectBookmark)[];
}

export default function NavFavorites(props: Props) {
  const { isMobile } = useSidebar();

  const handleCopy = () => {
    toast.promise(navigator.clipboard.writeText(props.favorites[0].url), {
      loading: "Copying link...",
      success: "Link copied to clipboard",
      error: "Failed to copy link",
    });
  };

  const handleDelete = () => {
    toast.promise(deleteBookmarkAction({ id: props.favorites[0].id }), {
      loading: "Deleting bookmark...",
      success: "Bookmark deleted successfully",
      error: "Failed to delete bookmark",
    });
  };

  const handleUnfavorite = () => {
    toast.promise(unfaviouriteBookmarkAction({ id: props.favorites[0].id }), {
      loading: "Unfavoriting bookmark...",
      success: "Unfavorited bookmark successfully",
      error: "Failed to unfavorite bookmark",
    });
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarMenu>
        {props.favorites.length > 0 ? (
          props.favorites.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url} title={item.id}>
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem onClick={handleUnfavorite}>
                    <StarOff className="text-muted-foreground" />
                    <span>Remove from Favorites</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleCopy}>
                    <Link className="text-muted-foreground" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    <ArrowUpRight className="text-muted-foreground" />
                    <span>Open in New Tab</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete}>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))
        ) : (
          <SidebarMenuItem className="text-muted-foreground text-sm ml-2">
            No Favorites yet
          </SidebarMenuItem>
        )}
        {props.favorites.length > 15 ? (
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : null}
      </SidebarMenu>
    </SidebarGroup>
  );
}
