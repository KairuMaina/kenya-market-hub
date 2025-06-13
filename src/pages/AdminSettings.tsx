
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Save, 
  Upload, 
  Globe, 
  Bell,
  Shield,
  Palette,
  Database,
  Mail
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';

const AdminSettings = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: 'Soko Smart',
    siteDescription: 'Kenya\'s Premier Digital Marketplace',
    heroImages: [],
    emailNotifications: true,
    orderNotifications: true,
    maintenanceMode: false,
    allowRegistration: true,
    commission: 5,
    currency: 'KSH',
    timezone: 'Africa/Nairobi'
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user || user.email !== 'gmaina424@gmail.com') {
    return <Navigate to="/" replace />;
  }

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully."
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      toast({
        title: "Images uploaded",
        description: `${files.length} hero image(s) uploaded successfully.`
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-0">
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 sm:h-8 sm:w-8" />
            Platform Settings
          </h1>
          <p className="text-gray-100 mt-2 text-sm sm:text-base">Configure your marketplace settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* General Settings */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  className="text-sm sm:text-base"
                />
              </div>
            </CardContent>
          </Card>

          {/* Hero Images */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Hero Section
              </CardTitle>
              <CardDescription>Manage hero slideshow images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroImages">Upload Hero Images</Label>
                <Input
                  id="heroImages"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm sm:text-base"
                />
                <p className="text-xs text-gray-500">Upload multiple images for the hero slideshow</p>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Email Notifications</Label>
                  <p className="text-xs text-gray-500">Receive email notifications for important events</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Order Notifications</Label>
                  <p className="text-xs text-gray-500">Get notified about new orders</p>
                </div>
                <Switch
                  checked={settings.orderNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, orderNotifications: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Access
              </CardTitle>
              <CardDescription>Platform security configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Maintenance Mode</Label>
                  <p className="text-xs text-gray-500">Temporarily disable public access</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Allow Registration</Label>
                  <p className="text-xs text-gray-500">Enable new user registrations</p>
                </div>
                <Switch
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commission">Platform Commission (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  value={settings.commission}
                  onChange={(e) => setSettings({...settings, commission: parseInt(e.target.value)})}
                  className="text-sm sm:text-base"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminSettings;
