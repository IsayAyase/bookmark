"use client";

import LayoutWrapper from "@/components/LayoutWrapper";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import { ProtectedRoute } from "../../components/auth/protected-route";
import { BookmarkList } from "../../components/bookmarks/bookmark-list";
import { BookmarkStats } from "../../components/bookmarks/bookmark-stats";
import { useAppStore } from "../../stores/app-store";

export default function DashboardPage() {
  const { fetchBookmarks, subscribeToRealtime, unsubscribeFromRealtime } = useAppStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchBookmarks();
    subscribeToRealtime();

    return () => {
      unsubscribeFromRealtime();
    };
  }, [fetchBookmarks, subscribeToRealtime, unsubscribeFromRealtime]);

  return (
    <ProtectedRoute>
      <LayoutWrapper>
        <div className="space-y-8">
          <BookmarkStats />
          <div>
            <h2 className="text-xl font-semibold mb-4">{`Hi, ${user?.display_name || "Pal"} your bookmarks:`}</h2>
            <BookmarkList />
          </div>
        </div>
      </LayoutWrapper>
    </ProtectedRoute>
  );
}
