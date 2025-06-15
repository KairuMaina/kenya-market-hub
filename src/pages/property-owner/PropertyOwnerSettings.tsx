
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Lock, Eye, Mail } from 'lucide-react';

const PropertyOwnerSettings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Account Settings
        </h1>
        <p className="text-green-100 mt-2">Manage your account preferences and privacy settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Choose what notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">New Inquiries</label>
                <p className="text-xs text-gray-500">Get notified when someone inquires about your properties</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Viewing Requests</label>
                <p className="text-xs text-gray-500">Get notified when someone requests a viewing</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Weekly Reports</label>
                <p className="text-xs text-gray-500">Receive weekly performance reports</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Marketing Tips</label>
                <p className="text-xs text-gray-500">Get tips to improve your property listings</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Privacy Settings
            </CardTitle>
            <CardDescription>Control your privacy and visibility settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Show Contact Info</label>
                <p className="text-xs text-gray-500">Display your contact information on listings</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Public Profile</label>
                <p className="text-xs text-gray-500">Make your profile visible to potential clients</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Analytics Tracking</label>
                <p className="text-xs text-gray-500">Allow us to track property performance analytics</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Preferences
            </CardTitle>
            <CardDescription>Manage your email communication preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Property Updates</label>
                <p className="text-xs text-gray-500">Updates about your property listings</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Newsletter</label>
                <p className="text-xs text-gray-500">Monthly property market insights</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Promotional Emails</label>
                <p className="text-xs text-gray-500">Special offers and feature announcements</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Enable Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start">
              View Login History
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default PropertyOwnerSettings;
