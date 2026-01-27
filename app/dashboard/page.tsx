"use client";

import { useEffect } from "react";
import { ProtectedRoute } from "../../components/auth/protected-route";
import { TaskList } from "../../components/tasks/task-list";
import { TaskStats } from "../../components/tasks/task-stats";
import { useAppStore } from "../../stores/app-store";

export default function DashboardPage() {
  const { fetchTasks } = useAppStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <TaskStats />
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
          <TaskList />
        </div>
      </div>
    </ProtectedRoute>
  );
}
