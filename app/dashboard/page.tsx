"use client";

import LayoutWrapper from "@/components/LayoutWrapper";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import { ProtectedRoute } from "../../components/auth/protected-route";
import { TaskList } from "../../components/tasks/task-list";
import { TaskStats } from "../../components/tasks/task-stats";
import { useAppStore } from "../../stores/app-store";

export default function DashboardPage() {
  const { fetchTasks } = useAppStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <ProtectedRoute>
      <LayoutWrapper>
        <div className="space-y-8">
          <TaskStats />
          <div>
            <h2 className="text-xl font-semibold mb-4">{`Hi, ${user?.display_name || "Pal"} your tasks:`}</h2>
            <TaskList />
          </div>
        </div>
      </LayoutWrapper>
    </ProtectedRoute>
  );
}
