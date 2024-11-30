"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Keybind } from "@/components/ui/keybind";
import { useCreateFolder } from "@/states/create-folder";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function CreateFolder() {
  const { setOpen } = useCreateFolder();

  useHotkeys("c", () => setOpen(true));

  return (
    <Button variant="secondary" onClick={() => setOpen(true)}>
      Create folder <Keybind shortcut={["c"]} inButton />
    </Button>
  );
}
