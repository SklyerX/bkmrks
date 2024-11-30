"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateFolder } from "@/states/create-folder";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createFolderAction } from "../_actions/create-folder";
import { toast } from "sonner";

export default function CreateFolderModal() {
  const { sectionId } = useParams();
  const { open, setOpen } = useCreateFolder();

  const [folderName, setFolderName] = useState<string>("");

  const handleCreation = async () => {
    const parsedSectionId = Array.isArray(sectionId) ? sectionId[0] : sectionId;

    toast.promise(
      createFolderAction({
        name: folderName,
        folderId: parsedSectionId,
      }),
      {
        loading: "Creating folder...",
        success: () => {
          setOpen(false);
          return "Folder created";
        },
        error: "Failed to create folder",
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create folder</DialogTitle>
          <DialogDescription>
            Create a folder to organize links more easily. Currently in{" "}
            {sectionId ? `${sectionId}` : "Root"}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input
            value={folderName}
            onChange={({ target }) => setFolderName(target.value)}
            placeholder="Folder name"
          />
          <Button
            className="mt-3"
            disabled={!folderName}
            onClick={handleCreation}
          >
            Create folder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
