import { create } from "zustand";

interface AddBookmarkState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useAddBookmark = create<AddBookmarkState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
