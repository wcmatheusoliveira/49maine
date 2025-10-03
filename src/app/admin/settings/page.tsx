"use client";

import { useState, useEffect } from "react";
import { Save, Palette, Globe, Shield, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface SiteSettings {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gaMeasurementId?: string;
}

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settings, setSettings] = useState<SiteSettings>({
    id: '',
    name: '49Maine',
    primaryColor: '#144663',
    secondaryColor: '#FBF8EB',
    accentColor: '#fbbf24',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        applyColors(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const applyColors = (data: SiteSettings) => {
    // Apply colors to CSS variables for immediate preview
    document.documentElement.style.setProperty('--primary-color', data.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', data.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', data.accentColor);
  };

  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading('Saving settings...');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        applyColors(data);
        toast.success('Settings saved successfully', { id: toastId });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (field: keyof SiteSettings, value: string) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    applyColors(newSettings);
  };

  const handleBackup = async () => {
    const toastId = toast.loading('Creating backup...');
    try {
      const response = await fetch('/api/admin/database/backup');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Get filename from Content-Disposition header or use default
        const contentDisposition = response.headers.get('Content-Disposition');
        const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
        const filename = filenameMatch ? filenameMatch[1] : `49maine-backup-${new Date().toISOString().split('T')[0]}.db`;

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Database backup downloaded', { id: toastId });
      } else {
        throw new Error('Backup failed');
      }
    } catch (error) {
      console.error('Backup error:', error);
      toast.error('Failed to create backup', { id: toastId });
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.db')) {
      toast.error('Please select a valid .db file');
      return;
    }

    if (!confirm('Are you sure you want to restore this backup? This will replace your current database. A backup of the current database will be created automatically.')) {
      event.target.value = ''; // Reset file input
      return;
    }

    setRestoring(true);
    const toastId = toast.loading('Restoring database...');

    try {
      const formData = new FormData();
      formData.append('database', file);

      const response = await fetch('/api/admin/database/restore', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Database restored successfully! Refreshing...', { id: toastId });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(data.error || 'Restore failed');
      }
    } catch (error: any) {
      console.error('Restore error:', error);
      toast.error(error.message || 'Failed to restore database', { id: toastId });
    } finally {
      setRestoring(false);
      event.target.value = ''; // Reset file input
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in both password fields');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const toastId = toast.loading('Updating password...');

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword,
          confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password updated successfully', { id: toastId });
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(data.error || 'Failed to update password');
      }
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error(error.message || 'Failed to update password', { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your site configuration and appearance.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general" className="gap-2">
            <Globe className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <Database className="w-4 h-4" />
            Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage basic site information and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Restaurant Name</Label>
                <Input
                  id="site-name"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ga-id">Google Analytics Measurement ID</Label>
                <Input
                  id="ga-id"
                  placeholder="G-XXXXXXXXXX"
                  value={settings.gaMeasurementId || ''}
                  onChange={(e) => setSettings({ ...settings, gaMeasurementId: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  Get your measurement ID from{' '}
                  <a
                    href="https://analytics.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Analytics
                  </a>
                  . Format: G-XXXXXXXXXX
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize your site's colors and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Main brand color used for headers, buttons, and key elements
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="primary-color"
                    value={settings.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="h-10 w-20 rounded border border-input cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Background and complementary color
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="secondary-color"
                    value={settings.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="h-10 w-20 rounded border border-input cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Highlight color for special elements and calls-to-action
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="accent-color"
                    value={settings.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="h-10 w-20 rounded border border-input cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={settings.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">Preview</h4>
                <div className="space-y-3">
                  <div
                    className="h-16 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    Primary Color
                  </div>
                  <div
                    className="h-16 rounded-lg flex items-center justify-center font-semibold border"
                    style={{ backgroundColor: settings.secondaryColor, borderColor: settings.primaryColor }}
                  >
                    Secondary Color
                  </div>
                  <div
                    className="h-16 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: settings.accentColor }}
                  >
                    Accent Color
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage authentication and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="admin-password">Admin Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter new password (min 8 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox id="2fa" />
                <Label htmlFor="2fa" className="font-normal cursor-pointer">
                  Enable two-factor authentication
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox id="require-password" defaultChecked />
                <Label htmlFor="require-password" className="font-normal cursor-pointer">
                  Require password for admin access
                </Label>
              </div>

              <div className="pt-4">
                <Button
                  variant="default"
                  className="bg-[#144663] hover:bg-[#0d3346]"
                  style={{ backgroundColor: settings.primaryColor }}
                  onClick={handlePasswordUpdate}
                  disabled={!newPassword || !confirmPassword}
                >
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Settings</CardTitle>
              <CardDescription>
                View database information and manage backups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <h3 className="font-medium">Database Status</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium">SQLite</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <p className="font-medium">124 KB</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tables:</span>
                    <p className="font-medium">12</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Backup:</span>
                    <p className="font-medium">2 hours ago</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Backup & Restore</h3>
                <div className="grid gap-3">
                  <Button
                    variant="default"
                    className="w-full bg-[#144663] hover:bg-[#0d3346]"
                    style={{ backgroundColor: settings.primaryColor }}
                    onClick={handleBackup}
                  >
                    Download Backup
                  </Button>

                  <div className="relative">
                    <input
                      type="file"
                      id="restore-file"
                      accept=".db"
                      onChange={handleRestore}
                      disabled={restoring}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById('restore-file')?.click()}
                      disabled={restoring}
                    >
                      {restoring ? 'Restoring...' : 'Restore from Backup'}
                    </Button>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-3">
                      ⚠️ Restoring a backup will replace your current database. A safety backup will be created automatically.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#144663] hover:bg-[#0d3346]"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
