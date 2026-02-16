"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { BookmarkForm } from "./bookmark-form";

export function BookmarkDialog({
  buttonSize = "md",
}: {
  buttonSize?: "sm" | "md";
}) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {buttonSize === "md" ? (
          <Button variant={"outline"}>
            <Plus />
            Add Bookmark
          </Button>
        ) : (
          <Button size={'icon'} variant={"outline"}>
            <Plus />
          </Button>
        )}
      </DialogTrigger>
      <BookmarkForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
    </Dialog>
  );
}
