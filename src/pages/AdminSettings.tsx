
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
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Soko Smart',
    siteDescription: 'Kenya\'s Premier Digital Marketplace',
    heroImages: [] as File[],
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally save to your backend/database
      console.log('Saving settings:', settings);
      
      // Update localStorage for demo purposes
      localStorage.setItem('sokoSmartSettings', JSON.stringify(settings));
      
      toast({
        title: "Settings saved successfully!",
        description: "Your platform settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSettings(prev => ({
        ...prev,
        heroImages: fileArray
      }));
      
      toast({
        title: "Images selected",
        description: `${files.length} hero image(s) selected. Click save to upload.`,
      });
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <MainLayout>
      <div className="space-y-3 sm:space-y-4 animate-fade-in">
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
            Platform Settings
          </h1>
          <p className="text-gray-100 mt-1 sm:mt-2 text-sm">Configure your marketplace settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* General Settings */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                General Settings
              </CardTitle>
              <CardDescription className="text-sm">Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-sm">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => updateSetting('siteName', e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-sm">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => updateSetting('siteDescription', e.target.value)}
                  className="text-sm min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm">Currency</Label>
                <Input
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => updateSetting('currency', e.target.value)}
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Hero Images */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
                Hero Section
              </CardTitle>
              <CardDescription className="text-sm">Manage hero slideshow images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroImages" className="text-sm">Upload Hero Images</Label>
                <Input
                  id="heroImages"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm"
                />
                <p className="text-xs text-gray-500">Upload multiple images for the hero slideshow</p>
                {settings.heroImages.length > 0 && (
                  <p className="text-xs text-green-600">
                    {settings.heroImages.length} image(s) selected
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                Notifications
              </CardTitle>
              <CardDescription className="text-sm">Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Email Notifications</Label>
                  <p className="text-xs text-gray-500">Receive email notifications for important events</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Order Notifications</Label>
                  <p className="text-xs text-gray-500">Get notified about new orders</p>
                </div>
                <Switch
                  checked={settings.orderNotifications}
                  onCheckedChange={(checked) => updateSetting('orderNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                Security & Access
              </CardTitle>
              <CardDescription className="text-sm">Platform security configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Maintenance Mode</Label>
                  <p className="text-xs text-gray-500">Temporarily disable public access</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Allow Registration</Label>
                  <p className="text-xs text-gray-500">Enable new user registrations</p>
                </div>
                <Switch
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) => updateSetting('allowRegistration', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commission" className="text-sm">Platform Commission (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  value={settings.commission}
                  onChange={(e) => updateSetting('commission', parseInt(e.target.value) || 0)}
                  className="text-sm"
                  min="0"
                  max="100"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-2 sm:pt-4">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminSettings;
