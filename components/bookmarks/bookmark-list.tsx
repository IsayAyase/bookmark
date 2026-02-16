"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAppStore, useFilteredBookmarks } from "@/stores/app-store";
import { Bookmark, BookmarkFilter } from "@/types";
import { ExternalLink, Trash2, Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BookmarkDialog } from "./bookmark-dialog";

export function BookmarkList() {
  const {
    loading,
    error,
    fetchBookmarks,
    deleteBookmark,
    setFilter,
    filter,
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState("");
  const bookmarks = useFilteredBookmarks();

  useEffect(() => {
    setFilter({ search: searchTerm || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleFilterChange = (newFilter: BookmarkFilter) => {
    setFilter({ ...newFilter, search: searchTerm || undefined });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <BookmarkDialog />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-destructive mb-4">{error}</div>
          <Button onClick={fetchBookmarks}>Try Again</Button>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            {searchTerm
              ? "No bookmarks found matching your search."
              : "No bookmarks yet. Add your first bookmark!"}
          </div>
          {searchTerm && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                handleFilterChange({});
              }}
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {bookmarks.map((bookmark) => (
            <BookmarkItem
              bookmark={bookmark}
              key={bookmark.id}
              onDelete={deleteBookmark}
            />
          ))}
        </div>
      )}

      <div className="text-sm text-muted-foreground text-center">
        {bookmarks.length} {bookmarks.length === 1 ? "bookmark" : "bookmarks"} found
      </div>
    </div>
  );
}

function BookmarkItem({
  bookmark,
  onDelete,
}: {
  bookmark: Bookmark;
  onDelete: (id: string) => Promise<{ error?: string }>;
}) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this bookmark?")) return;

    const result = await onDelete(bookmark.id);
    if (result.error) {
      console.error(result.error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Extract domain from URL for display
  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium">{bookmark.title}</h3>
          </div>

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {getDomain(bookmark.url)}
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="text-xs text-muted-foreground">
            Added: {formatDate(bookmark.created_at)}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
