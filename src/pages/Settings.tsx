import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Database,
  Download,
  Trash2,
  AlertTriangle
} from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      desktop: false,
      projectUpdates: true,
      taskAssignments: true,
      deadlineReminders: true
    },
    privacy: {
      profileVisibility: "team",
      activityStatus: true,
      dataSharing: false
    },
    preferences: {
      language: "en",
      timezone: "UTC-8",
      dateFormat: "MM/DD/YYYY"
    }
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Your data export will be ready shortly and sent to your email.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "This action cannot be undone. Please contact support for assistance.",
      variant: "destructive"
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Settings</h2>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <nav className="space-y-2">
                  <a href="#notifications" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </a>
                  <a href="#privacy" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                    <Shield className="h-4 w-4" />
                    <span>Privacy</span>
                  </a>
                  <a href="#preferences" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                    <Globe className="h-4 w-4" />
                    <span>Preferences</span>
                  </a>
                  <a href="#appearance" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                    <Palette className="h-4 w-4" />
                    <span>Appearance</span>
                  </a>
                  <a href="#data" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                    <Database className="h-4 w-4" />
                    <span>Data & Privacy</span>
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Notifications */}
            <Card id="notifications">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch 
                    id="email-notifications"
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        notifications: {...settings.notifications, email: checked}
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch 
                    id="push-notifications"
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        notifications: {...settings.notifications, push: checked}
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="project-updates">Project Updates</Label>
                  <Switch 
                    id="project-updates"
                    checked={settings.notifications.projectUpdates}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        notifications: {...settings.notifications, projectUpdates: checked}
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="task-assignments">Task Assignments</Label>
                  <Switch 
                    id="task-assignments"
                    checked={settings.notifications.taskAssignments}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        notifications: {...settings.notifications, taskAssignments: checked}
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card id="privacy">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Privacy & Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select 
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) => 
                      setSettings({
                        ...settings,
                        privacy: {...settings.privacy, profileVisibility: value}
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="team">Team Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="activity-status">Show Activity Status</Label>
                  <Switch 
                    id="activity-status"
                    checked={settings.privacy.activityStatus}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        privacy: {...settings.privacy, activityStatus: checked}
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card id="preferences">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={settings.preferences.language}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.preferences.timezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card id="appearance">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Appearance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex space-x-2">
                    <Button 
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => setTheme("light")}
                      size="sm"
                    >
                      Light
                    </Button>
                    <Button 
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => setTheme("dark")}
                      size="sm"
                    >
                      Dark
                    </Button>
                    <Button 
                      variant={theme === "system" ? "default" : "outline"}
                      onClick={() => setTheme("system")}
                      size="sm"
                    >
                      System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data & Privacy */}
            <Card id="data">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Data & Privacy</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Button variant="outline" onClick={handleExportData} className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-destructive flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Danger Zone
                    </h4>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      className="w-full justify-start"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;