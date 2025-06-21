"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { sendSettingsUpdateEmail } from "@/lib/actions/settings.server";
import {
  Mail,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Shield,
  User,
  Database,
  Palette,
} from "lucide-react";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError("");
    setOpen(true);
  };

  const handleConfirm = async () => {
    setPending(true);
    setError("");
    try {
      await sendSettingsUpdateEmail({ email, password });
      setSuccess(true);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      toast.success(
        "Settings updated successfully! Check your backup email for the new credentials.",
      );
    } catch {
      setError("Failed to send email. Please try again.");
      toast.error("Failed to update settings");
    } finally {
      setPending(false);
      setOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your admin account and application settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Admin Panel</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Settings Card */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 dark:bg-primary/5 dark:border-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Account Security</CardTitle>
                  <CardDescription>
                    Update your admin email and password for enhanced security
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Admin Email</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      New Admin Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@yoursite.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 h-11 bg-gray-400/10 backdrop-blur-sm"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This will become your new login email for the admin
                      dashboard
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Password Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <KeyRound className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Password Security</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        New Password
                      </Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter new password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={8}
                          className="pl-10 h-11 bg-gray-400/10 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                          className="pl-10 h-11 bg-gray-400/10 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2">
                      <Shield className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      Password requirements: At least 8 characters long, include
                      uppercase, lowercase, numbers, and special characters for
                      maximum security.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={pending}
                    size="lg"
                    className="min-w-[200px]"
                  >
                    {pending ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Updating...
                      </div>
                    ) : (
                      <>
                        <Settings className="mr-2 h-4 w-4" />
                        Update Settings
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Status Messages */}
              {success && (
                <div className="flex items-center gap-3 text-green-600 dark:text-green-400 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">
                      Settings Updated Successfully!
                    </p>
                    <p className="text-sm opacity-90">
                      Check your backup email for the new credentials.
                    </p>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-3 text-red-600 dark:text-red-400 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Update Failed</p>
                    <p className="text-sm opacity-90">{error}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info Cards */}
        <div className="space-y-4">
          {/* Security Tips */}
          <Card className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 backdrop-blur-sm border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Security Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 flex-shrink-0"></div>
                <p>Use a unique password that you don&apos;t use elsewhere</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 flex-shrink-0"></div>
                <p>
                  Include a mix of uppercase, lowercase, numbers, and symbols
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 flex-shrink-0"></div>
                <p>Keep your backup email secure and accessible</p>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-gradient-to-br from-green-500/5 to-green-600/5 backdrop-blur-sm border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Database</span>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400"></div>
                  <span className="text-xs">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Email Service</span>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400"></div>
                  <span className="text-xs">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Backup System</span>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400"></div>
                  <span className="text-xs">Running</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-purple-500/5 to-purple-600/5 backdrop-blur-sm border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Database className="mr-2 h-4 w-4" />
                Backup Database
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Mail className="mr-2 h-4 w-4" />
                Test Email Service
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Shield className="mr-2 h-4 w-4" />
                Security Audit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Confirm Settings Update
            </DialogTitle>
            <DialogDescription>
              This action will update your admin credentials and send the new
              information to your backup email.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-600 dark:text-yellow-400 mb-1">
                    Important Security Notice
                  </p>
                  <p className="text-yellow-600/80 dark:text-yellow-400/80">
                    Make sure you have access to your backup email before
                    proceeding. You&apos;ll need the new credentials to log in
                    next time.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">New Email:</span>
                <span className="text-primary">{email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Password:</span>
                <span className="text-muted-foreground">
                  {"•".repeat(password.length)}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={pending}
              className="min-w-[120px]"
            >
              {pending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Updating...
                </div>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm Update
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
