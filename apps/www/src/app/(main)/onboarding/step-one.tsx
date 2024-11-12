"use client";

import { FileUploader } from "@/components/file-uploader";
import { useValidateStep } from "@/states/validate-step";
import { Bookmark } from "lucide-react";
import Link from "next/link";

// TODO: on upload and db query send the request and update the state

export default function StepOne() {
  const { setIsValid, setSkip } = useValidateStep();

  return (
    <div>
      <h3 className="text-xl font-medium inline-flex items-center gap-2">
        <Bookmark className="size-6" />
        Import Bookmarks
      </h3>
      <p className="mt-1.5 text-lg text-muted-foreground">
        Bkmrks allows you import your existing bookmarks and tabs from your
        browser. If you don't have the file ready, you can export your bookmarks
        from using the{" "}
        <Link
          href="https://www.webstore.chrom.com/en/bookmarks-manager/bookmarks-manager"
          className="text-sky-600 underline underline-offset-2"
        >
          Bkmrks Extension
        </Link>
        .
      </p>
      <FileUploader
        multiple={false}
        maxFiles={1}
        showPreview={false}
        className="mt-10"
      />
      <button
        type="button"
        className="text-muted-foreground text-lg mt-4 hover:text-black transition-colors"
        onClick={() => setSkip(true)}
      >
        Nah I'll do it later
      </button>
    </div>
  );
}
