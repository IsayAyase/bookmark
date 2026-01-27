"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { supabase } from "@/lib/supabase";
import { Task } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in-progress", "completed"]),
  due_date: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TaskForm({ task, onSuccess, onCancel }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || "",
          priority: task.priority,
          status: task.status,
          due_date: task.due_date
            ? new Date(task.due_date).toISOString().split("T")[0]
            : "",
        }
      : {
          title: "",
          description: "",
          priority: "medium",
          status: "pending",
          due_date: "",
        },
  });

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("User not authenticated");
        return;
      }

      const taskData = {
        user_id: user.id,
        title: data.title,
        description: data.description || null,
        priority: data.priority,
        status: data.status,
        due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
      };

      let result;
      if (task) {
        result = await supabase
          .from("tasks")
          .update(taskData)
          .eq("id", task.id)
          .eq("user_id", user.id);
      } else {
        result = await supabase.from("tasks").insert(taskData);
      }

      if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Enter task title"
            {...register("title")}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={3}
            className="flex min-h-15 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter task description (optional)"
            {...register("description")}
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register("priority")}
              disabled={isSubmitting}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p className="text-sm text-destructive">
                {errors.priority.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register("status")}
              disabled={isSubmitting}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && (
              <p className="text-sm text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            type="date"
            {...register("due_date")}
            disabled={isSubmitting}
          />
          {errors.due_date && (
            <p className="text-sm text-destructive">
              {errors.due_date.message}
            </p>
          )}
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting} className="">
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                {task ? "Updating..." : "Creating..."}
              </div>
            ) : task ? (
              "Update Task"
            ) : (
              "Create Task"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
