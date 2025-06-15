
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminSettings = () => {
  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-gray-600 to-slate-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8" />
              Admin Settings
            </h1>
            <p className="text-gray-100 mt-2">Configure system settings and preferences</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">System Settings</CardTitle>
              <CardDescription>Manage application configuration and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Settings panel coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminSettings;
