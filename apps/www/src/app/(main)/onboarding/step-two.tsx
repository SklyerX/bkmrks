import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useValidateStep } from "@/states/validate-step";
import { Folder } from "lucide-react";
import React from "react";

export default function StepTwo() {
  const { setIsValid, setSkip } = useValidateStep();

  return (
    <div>
      <h3 className="text-xl font-medium inline-flex items-center gap-2">
        <Folder className="size-6" />
        Create a folder
      </h3>
      <p className="mt-1.5 text-lg text-muted-foreground">
        create a folder to organize your bookmarks
      </p>
      <div>
        <Input placeholder="Folder name" className="mt-10" />
        <Button className="mt-5">Create</Button>
      </div>
      <button
        type="button"
        className="text-muted-foreground text-lg mt-10 hover:text-black transition-colors"
        onClick={() => setSkip(true)}
      >
        Nah I'll do it later
      </button>
    </div>
  );
}
