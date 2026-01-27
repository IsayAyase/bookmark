"use client";

import { useAppStore, useTaskStats } from "@/stores/app-store";
import { AlertCircle, CheckCircle, Clock, ListTodo } from "lucide-react";

export function TaskStats() {
  const stats = useTaskStats();
  // Calculate high priority count
  const { loading, tasks } = useAppStore();
  const highPriorityCount = tasks.filter(
    (t) => t.priority === "high" && t.status !== "completed",
  ).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-muted animate-pulse rounded-lg p-4 h-20"
            />
          ))}
        </div>
        <div className="bg-muted rounded-md h-3.5 w-32" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: ListTodo,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: AlertCircle,
      color: "text-gray-600 bg-gray-50 border-gray-200",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600 bg-green-50 border-green-200",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className={`border rounded-lg p-4 ${card.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <card.icon className="w-5 h-5 opacity-60" />
            </div>
          </div>
        ))}
      </div>

      {highPriorityCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle />
            <span className="text-sm font-medium">
              {highPriorityCount} high priority{" "}
              {highPriorityCount === 1 ? "task" : "tasks"} need attention
            </span>
          </div>
        </div>
      )}

      {stats.total > 0 && (
        <div className="text-sm text-muted-foreground w-fit">
          Completion rate: {Math.round((stats.completed / stats.total) * 100)}%
        </div>
      )}
    </div>
  );
}
