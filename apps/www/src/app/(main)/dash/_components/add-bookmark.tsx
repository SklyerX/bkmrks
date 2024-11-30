"use client";

import { useAddBookmark } from "@/states/add-bookmark";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "@/components/ui/button";
import { Keybind } from "@/components/ui/keybind";

export default function AddBookmark() {
  const { setOpen } = useAddBookmark();

  useHotkeys("n", () => setOpen(true));

  return (
    <Button onClick={() => setOpen(true)}>
      Add Bookmark <Keybind shortcut={["n"]} inButton />
    </Button>
  );
}
