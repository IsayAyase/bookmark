"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, updateDisplayName, signOut, resetPassword, loading } =
    useAuthStore();
  const [name, setName] = useState<string>(user?.display_name ?? "");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (user?.display_name !== undefined) {
      setName(user.display_name ?? "");
    }
  }, [user?.display_name]);

  const onSave = async () => {
    if (!name) {
      setStatus("Name cannot be empty");
      return;
    }
    const res = await updateDisplayName(name);
    if (res?.error) {
      setStatus(res.error.message);
    } else {
      setStatus("Profile updated");
    }
  };

  const onLogout = async () => {
    await signOut();
  };

  const onReset = async () => {
    if (!user?.email) return;
    const res = await resetPassword(user.email);
    if (res?.error) {
      setStatus(res.error.message);
    } else {
      setStatus("Password reset email sent");
    }
  };

  return (
    <ProtectedRoute>
      <LayoutWrapper>
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email} disabled />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button disabled={loading} onClick={onSave}>
            Save
          </Button>
          <Button disabled={loading} variant="outline" onClick={onReset}>
            Reset Password
          </Button>
          <Button disabled={loading} variant="destructive" onClick={onLogout}>
            Logout
          </Button>
        </div>
        {status && (
          <div className="text-sm text-muted-foreground mt-2">{status}</div>
        )}
      </LayoutWrapper>
    </ProtectedRoute>
  );
}
