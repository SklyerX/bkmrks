"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEditBookmark } from "@/states/edit-bookmark";
import BookmarkForm from "./bookmark-form";
import type { BookmarkEntryWithId } from "@/lib/validators/add-bookmark";

export default function EditBookmarkModal() {
  const { open, closeDialog, bookmark } = useEditBookmark();

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bookmark</DialogTitle>
        </DialogHeader>
        <BookmarkForm
          bookmark={bookmark as BookmarkEntryWithId}
          onCompleted={closeDialog}
        />
      </DialogContent>
    </Dialog>
  );
}
