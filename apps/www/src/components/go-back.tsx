"use client";

import React from "react";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GoBack() {
  const router = useRouter();

  return (
    <Button variant="ghost" size="icon" onClick={() => router.back()}>
      <ChevronLeft className="size-6" />
    </Button>
  );
}
