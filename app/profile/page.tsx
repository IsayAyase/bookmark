"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth-store";

export default function ProfilePage() {
  const { user, signOut, loading } = useAuthStore();

  const onLogout = async () => {
    await signOut();
  };

  return (
    <ProtectedRoute>
      <LayoutWrapper>
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={user?.display_name ?? "-"} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email} disabled />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button disabled={loading} variant="destructive" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </LayoutWrapper>
    </ProtectedRoute>
  );
}
