"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEditBookmark } from "@/states/edit-bookmark";
import React from "react";
import BookmarkForm from "./bookmark-form";

export default function EditBookmarkModal() {
  const { open, closeDialog, bookmark } = useEditBookmark();

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bookmark</DialogTitle>
        </DialogHeader>
        {/* TODO: add bookmark edit form and update bookmark edit form */}
      </DialogContent>
    </Dialog>
  );
}
