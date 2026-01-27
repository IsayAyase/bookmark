"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  formatDate,
  getPriorityColor,
  getStatusColor,
  truncateText,
} from "@/lib/utils";
import { useAppStore, useFilteredTasks } from "@/stores/app-store";
import { Task, TaskFilter } from "@/types";
import { AlertCircle, CheckCircle, Clock, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { TaskDialog } from "./task-dialog";

export function TaskList() {
  const {
    loading,
    error,
    fetchTasks,
    deleteTask,
    updateTask,
    setFilter,
    filter,
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState("");
  const tasks = useFilteredTasks();

  useEffect(() => {
    setFilter({ ...filter, search: searchTerm || undefined });
  }, [searchTerm]);
  const handleFilterChange = (newFilter: TaskFilter) => {
    setFilter({ ...newFilter, search: searchTerm || undefined });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filter.status || ""}
            onChange={(e) =>
              handleFilterChange({
                ...filter,
                status: (e.target.value as Task["status"]) || undefined,
              })
            }
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filter.priority || ""}
            onChange={(e) =>
              handleFilterChange({
                ...filter,
                priority: (e.target.value as Task["priority"]) || undefined,
              })
            }
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-destructive mb-4">{error}</div>
          <Button onClick={fetchTasks}>Try Again</Button>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            {searchTerm || filter.status || filter.priority
              ? "No tasks found matching your criteria."
              : "No tasks yet. Create your first task!"}
          </div>
          {(searchTerm || filter.status || filter.priority) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                handleFilterChange({});
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {tasks.map((task, index) => (
            <TaskItem
              task={task}
              key={index}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          ))}
        </div>
      )}

      <div className="text-sm text-muted-foreground text-center">
        {tasks.length} {tasks.length === 1 ? "task" : "tasks"} found
      </div>
    </div>
  );
}

export function TaskItem({
  task,
  onDelete,
  onUpdate,
}: {
  task: Task;
  onDelete: (id: string) => Promise<{ error?: string }>;
  onUpdate: (
    id: string,
    v: { status: Task["status"] },
  ) => Promise<{ error?: string }>;
}) {
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const result = await onDelete(taskId);
    if (result.error) {
      console.error(result.error);
    }
  };

  const handleUpdateTaskStatus = async (
    taskId: string,
    newStatus: Task["status"],
  ) => {
    const result = await onUpdate(taskId, { status: newStatus });
    if (result.error) {
      console.error(result.error);
    }
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      key={task.id}
      className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            <h3 className="font-medium">{task.title}</h3>
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground">
              {truncateText(task.description, 150)}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`px-2 py-1 rounded-full capitalize border ${getStatusColor(task.status)}`}
            >
              {task.status.replace("-", " ")}
            </span>
            <span
              className={`px-2 py-1 rounded-full capitalize border ${getPriorityColor(task.priority)}`}
            >
              {task.priority}
            </span>
            {task.due_date && (
              <span className="text-muted-foreground">
                Due: {formatDate(task.due_date)}
              </span>
            )}
            <span className="text-muted-foreground">
              Created: {formatDate(task.created_at)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {task.status !== "completed" && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleUpdateTaskStatus(task.id, "completed")}
              className="text-green-600 hover:text-green-700"
            >
              <CheckCircle />
            </Button>
          )}
          <TaskDialog task={task} />
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleDeleteTask(task.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
}
