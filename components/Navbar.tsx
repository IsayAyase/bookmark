import { UserIcon } from "lucide-react";
import Link from "next/link";
import { TaskDialog } from "./tasks/task-dialog";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <p className="text-muted-foreground">Manage your tasks efficiently</p>
      </div>
      <div className="flex items-center gap-2">
        <TaskDialog />
        <Link href="/profile">
          <Button
            aria-label="Profile"
            size={'icon'}
            variant={'outline'}
          >
            <UserIcon />
          </Button>
        </Link>
      </div>
    </div>
  );
}
