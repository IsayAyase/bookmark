import { UserIcon } from "lucide-react";
import Link from "next/link";
import { BookmarkDialog } from "./bookmarks/bookmark-dialog";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between mb-8">
      <Link href="/dashboard">
        <h1 className="text-3xl font-bold">Bookmark Manager</h1>
        <p className="text-muted-foreground">Save and manage your favorite links</p>
      </Link>

      <div className="flex items-center gap-2">
        <BookmarkDialog buttonSize="sm" />
        <Link href="/profile">
          <Button aria-label="Profile" size={"icon"} variant={"outline"}>
            <UserIcon />
          </Button>
        </Link>
      </div>
    </div>
  );
}
