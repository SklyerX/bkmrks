import type { SelectBookmark } from "@/db/schema";
import { create } from "zustand";

interface EditBookmarkState {
  open: boolean;
  bookmark: typeof SelectBookmark | null;

  openDialog: (bookmark: typeof SelectBookmark) => void;
  closeDialog: () => void;
}

export const useEditBookmark = create<EditBookmarkState>((set) => ({
  open: false,
  bookmark: null,
  openDialog: (bookmark) => set({ open: true, bookmark }),
  closeDialog: () => set({ open: false, bookmark: null }),
}));
