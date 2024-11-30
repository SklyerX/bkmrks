"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddBookmark } from "@/states/add-bookmark";
import { useParams } from "next/navigation";
import React from "react";
import BookmarkForm from "./bookmark-form";

export default function AddBookmarkModal() {
  const { sectionId } = useParams();
  const { open, setOpen } = useAddBookmark();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bookmark</DialogTitle>
          <DialogDescription>
            Add a link to a collection or to the root. Currently in{" "}
            {sectionId ? `${sectionId}` : "Root"}
          </DialogDescription>
        </DialogHeader>
        <div>
          <BookmarkForm onCompleted={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
