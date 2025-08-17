import { User, Key, Bell, Shield } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [profileData, setProfileData] = useState({
    email: user?.email || "",
    full_name: user?.full_name || "",
  });

  const handleProfileUpdate = async () => {
    // TODO: Implement profile update
    alert("Profile update functionality coming soon!");
  };

  const handlePasswordChange = async () => {
    // TODO: Implement password change
    alert("Password change functionality coming soon!");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={profileData.full_name}
                onChange={(e) =>
                  setProfileData({ ...profileData, full_name: e.target.value })
                }
              />
            </div>
            <Button onClick={handleProfileUpdate}>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>
              Manage your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <Input
                  id="current_password"
                  type="password"
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <Button onClick={handlePasswordChange}>Change Password</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Notification settings coming soon...
            </p>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Account Information</CardTitle>
            </div>
            <CardDescription>
              Your account details and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Type</span>
                <span className="font-medium">
                  {user?.is_superuser ? "Administrator" : "Standard User"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Status</span>
                <span className="font-medium">
                  {user?.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-medium">{user?.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
