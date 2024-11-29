import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  fetchSharesAction,
  type ShareReturnObject,
} from "@/app/(main)/dash/_actions/fetch-shares";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { inviteUserAction } from "@/app/(main)/dash/_actions/invite-user";
import type { permissionRole } from "@/db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { z } from "zod";
import { useAction } from "next-safe-action/hooks";
import { removeShareAction } from "@/app/(main)/dash/_actions/remove-share";

// TODO: fix share design

type PermissionEnum = (typeof permissionRole.enumValues)[number];

const isValidEmail = (email: string) => {
  const { success } = z.string().email().safeParse(email);
  return success;
};

export default function ShareSettings() {
  const [shares, setShares] = useState<ShareReturnObject[]>([]);
  const [targetEmail, setTargetEmail] = useState("");
  const [role, setRole] = useState<PermissionEnum>("VIEWER");
  const { sectionId } = useParams();

  const { execute, status, result } = useAction(inviteUserAction);

  const folderId = Array.isArray(sectionId) ? sectionId[0] : sectionId;

  useEffect(() => {
    const loadShares = async () => {
      if (!folderId) {
        toast.error("Invalid page");
        return;
      }
      const result = await fetchSharesAction({ folderId });
      setShares(result?.data ?? []);
      console.log("Shares:", result?.data);
    };

    loadShares();
  }, []);

  const handleInvite = async () => {
    console.log("Inviting", targetEmail, folderId, role);
    if (!folderId) return;

    execute({
      targetEmail,
      folderId,
      role,
    });
  };

  const handleRemove = (targetId: string) => {
    toast.promise(
      removeShareAction({ targetId, folderId: folderId as string }),
      {
        loading: "Removing...",
        success: () => {
          window.location.reload();

          return "Removed successfully!";
        },
        error: "Failed to remove",
      }
    );
  };

  useEffect(() => {
    if (status === "hasSucceeded") {
      toast.success("Invitation sent!");
      window.location.reload();
    }
    if (status === "hasErrored") {
      toast.error("Invitation failed!", {
        description: result.serverError,
      });
      console.log(result.data);
    }
  }, [status]);

  const isEmailValid = isValidEmail(targetEmail);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Share</h3>
      <div className="flex items-center gap-2">
        <Input
          placeholder="john.doe@gmail.com"
          value={targetEmail}
          onChange={(e) => setTargetEmail(e.target.value)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">Role</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{role}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={role}
              onValueChange={(e) => setRole(e as PermissionEnum)}
            >
              <DropdownMenuRadioItem value="EDITOR">
                Editor
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="VIEWER">
                Viewer
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button
        onClick={handleInvite}
        disabled={!isEmailValid || status === "executing"}
      >
        Share
      </Button>
      <h3 className="text-xl font-medium">Shared with</h3>
      {shares.map((share) => (
        <div key={share.user.id}>
          <div>
            {share.user.name} ({share.user.email})
          </div>
          <div>{share.role}</div>
          <Button onClick={() => handleRemove(share.user.id)}>Remove</Button>
        </div>
      ))}
    </div>
  );
}
