"use client";

import { Button } from "@/components/ui/button";
import { CircleMinus } from "lucide-react";
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
import { useAction } from "next-safe-action/hooks";
import { leaveShareAction } from "../_actions/leave-share";
import { toast } from "sonner";

interface LeaveShareProps {
  id: string;
}

export default function LeaveShare({ id }: LeaveShareProps) {
  const { execute } = useAction(leaveShareAction, {
    onSuccess: () => toast.success("Shared resource removed successfully!"),
    onError: (err) =>
      toast.error("Something went wrong!", {
        description: err.error.serverError,
      }),
    onSettled: () => toast.dismiss("remove-share"),
  });

  const handleDelete = () => {
    execute({ folderId: id });

    toast.loading("Removing shared resource...", {
      id: "remove-share",
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <CircleMinus className="size-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove your
            access to this shared resource. You will need to get an invite from
            the owner to access it again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
