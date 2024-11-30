import { create } from "zustand";

interface CreateFolderState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useCreateFolder = create<CreateFolderState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
