"use client";

import { useAppStore, useBookmarkStats } from "@/stores/app-store";
import { Bookmark, Link2 } from "lucide-react";

export function BookmarkStats() {
  const stats = useBookmarkStats();
  const { loading } = useAppStore();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-muted animate-pulse rounded-lg p-4 h-20" />
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">Total Bookmarks</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 opacity-60 text-blue-600" />
          <Link2 className="w-5 h-5 opacity-60 text-blue-600" />
        </div>
      </div>
    </div>
  );
}
