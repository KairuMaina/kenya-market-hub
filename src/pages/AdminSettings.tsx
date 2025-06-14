
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, Bell, Shield, Globe, Palette } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    siteName: 'Soko Smart',
    siteDescription: 'Your one-stop marketplace for everything',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    maxFileSize: 10,
    supportEmail: 'support@sokosmart.com',
    supportPhone: '+254 700 000 000'
  });

  // Fetch current settings
  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Save settings mutation
  const saveSettings = useMutation({
    mutationFn: async (newSettings: typeof settings) => {
      const settingsArray = Object.entries(newSettings).map(([key, value]) => ({
        setting_key: key,
        setting_value: { value },
        updated_by: null // Would be current user in real app
      }));
      
      for (const setting of settingsArray) {
        const { error } = await supabase
          .from('admin_settings')
          .upsert(setting, { onConflict: 'setting_key' });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast({ title: "Settings saved successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error saving settings", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    saveSettings.mutate(settings);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8" />
              System Settings
            </h1>
            <p className="text-gray-200 mt-2">Configure your application settings and preferences</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Basic application configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowRegistration">Allow User Registration</Label>
                  <Switch
                    id="allowRegistration"
                    checked={settings.allowRegistration}
                    onCheckedChange={(checked) => handleSettingChange('allowRegistration', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="orderNotifications">Order Notifications</Label>
                  <Switch
                    id="orderNotifications"
                    checked={settings.orderNotifications}
                    onCheckedChange={(checked) => handleSettingChange('orderNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>Technical configuration options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone}
                    onChange={(e) => handleSettingChange('supportPhone', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme & Appearance
                </CardTitle>
                <CardDescription>Customize the look and feel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Color Scheme</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="w-full h-8 bg-blue-500 rounded cursor-pointer"></div>
                      <div className="w-full h-8 bg-green-500 rounded cursor-pointer"></div>
                      <div className="w-full h-8 bg-purple-500 rounded cursor-pointer"></div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Layout Options</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Compact Mode</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Dark Mode</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={saveSettings.isPending}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveSettings.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminSettings;
