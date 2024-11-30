import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { renameFolderAction } from "@/app/(main)/dash/_actions/rename-folder";
import { redirect, useParams } from "next/navigation";
import { deleteFolderAction } from "@/app/(main)/dash/_actions/delete-folder";

export default function AdvancedSettings() {
  const [folderName, setFolderName] = useState("");
  const { sectionId } = useParams();

  const parsedSectionId = Array.isArray(sectionId) ? sectionId[0] : sectionId;

  const handleRename = () => {
    toast.promise(
      renameFolderAction({ id: parsedSectionId as string, name: folderName }),
      {
        loading: "Renaming folder...",
        success: "Folder renamed successfully!",
        error: "An error occurred while renaming the folder.",
      }
    );
  };

  const handleDelete = () => {
    toast.promise(deleteFolderAction({ id: parsedSectionId as string }), {
      loading: "Deleting folder...",
      success: "Folder deleted successfully!",
      error: "An error occurred while deleting the folder.",
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Advanced Settings</h2>

      <div className="mt-4">
        <h4 className="text-lg font-semibold">Rename</h4>
        <Input
          maxLength={50}
          placeholder="Enter a new name"
          className="mt-2"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <Button size="sm" className="mt-2" onClick={handleRename}>
          Rename
        </Button>
      </div>

      <div className="mt-10 border border-red-500 relative p-4 rounded-md">
        <h4 className="absolute -top-3 left-3 px-3 bg-background text-red-700">
          Danger Zone
        </h4>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Once you delete this folder, there is no going back. Please be
            certain.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete Folder
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  folder and all files within it.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
