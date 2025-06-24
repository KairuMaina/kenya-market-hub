
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  Send,
  Settings,
  Users,
  Mail,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  recipient_type: 'all' | 'users' | 'vendors' | 'drivers';
  status: 'draft' | 'sent' | 'scheduled';
  created_at: string;
  scheduled_at?: string;
  sent_count?: number;
  read_count?: number;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    recipient_type: 'all' as const,
    scheduled_at: ''
  });
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    auto_approve_vendors: false,
    order_notifications: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    // Mock data - in real implementation, fetch from Supabase
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Welcome to Soko Smart',
        message: 'Thank you for joining our marketplace!',
        type: 'success',
        recipient_type: 'users',
        status: 'sent',
        created_at: new Date().toISOString(),
        sent_count: 1234,
        read_count: 890
      },
      {
        id: '2',
        title: 'System Maintenance',
        message: 'Scheduled maintenance on Sunday 2AM-4AM',
        type: 'warning',
        recipient_type: 'all',
        status: 'scheduled',
        created_at: new Date().toISOString(),
        scheduled_at: new Date(Date.now() + 86400000).toISOString()
      }
    ];
    setNotifications(mockNotifications);
  };

  const sendNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in title and message',
        variant: 'destructive'
      });
      return;
    }

    const notification: Notification = {
      id: Date.now().toString(),
      ...newNotification,
      status: newNotification.scheduled_at ? 'scheduled' : 'sent',
      created_at: new Date().toISOString(),
      sent_count: newNotification.scheduled_at ? 0 : Math.floor(Math.random() * 1000) + 100,
      read_count: 0
    };

    setNotifications(prev => [notification, ...prev]);
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      recipient_type: 'all',
      scheduled_at: ''
    });

    toast({
      title: notification.status === 'scheduled' ? 'Notification Scheduled' : 'Notification Sent',
      description: `Successfully ${notification.status === 'scheduled' ? 'scheduled' : 'sent'} notification`
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notification Center</h2>
        <p className="text-gray-600">Manage and send notifications to users</p>
      </div>

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send">Send Notification</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Create Notification
              </CardTitle>
              <CardDescription>Send notifications to users, vendors, or drivers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Notification title"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select 
                    value={newNotification.type} 
                    onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Notification message"
                  rows={4}
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipients</label>
                  <Select 
                    value={newNotification.recipient_type} 
                    onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, recipient_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="users">Customers Only</SelectItem>
                      <SelectItem value="vendors">Vendors Only</SelectItem>
                      <SelectItem value="drivers">Drivers Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Schedule (Optional)</label>
                  <Input
                    type="datetime-local"
                    value={newNotification.scheduled_at}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, scheduled_at: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={sendNotification} className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  {newNotification.scheduled_at ? 'Schedule' : 'Send'} Notification
                </Button>
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification History
              </CardTitle>
              <CardDescription>View all sent and scheduled notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(notification.status)}
                          <h3 className="font-medium">{notification.title}</h3>
                          <Badge className={getTypeColor(notification.type)}>
                            {notification.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {notification.recipient_type}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        {notification.sent_count && (
                          <span>Sent: {notification.sent_count}</span>
                        )}
                        {notification.read_count && (
                          <span>Read: {notification.read_count}</span>
                        )}
                        {notification.scheduled_at && (
                          <span>Scheduled: {new Date(notification.scheduled_at).toLocaleString()}</span>
                        )}
                      </div>
                      <span>Created: {new Date(notification.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure notification preferences and automation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Notifications</span>
                  </div>
                  <Switch
                    checked={settings.email_notifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, email_notifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Push Notifications</span>
                  </div>
                  <Switch
                    checked={settings.push_notifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, push_notifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span>SMS Notifications</span>
                  </div>
                  <Switch
                    checked={settings.sms_notifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, sms_notifications: checked }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Automation Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto-approve Vendors</div>
                    <div className="text-sm text-gray-500">Automatically approve vendor applications</div>
                  </div>
                  <Switch
                    checked={settings.auto_approve_vendors}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, auto_approve_vendors: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Order Notifications</div>
                    <div className="text-sm text-gray-500">Send notifications for order status changes</div>
                  </div>
                  <Switch
                    checked={settings.order_notifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, order_notifications: checked }))
                    }
                  />
                </div>
              </div>

              <Button className="w-full">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenter;
