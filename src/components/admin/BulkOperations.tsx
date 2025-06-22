
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Download,
  Upload,
  Trash2,
  Edit,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BulkOperation {
  id: string;
  type: 'email' | 'status_update' | 'delete' | 'export';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  total: number;
  completed: number;
  errors: string[];
  created_at: string;
}

const BulkOperations = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [operations, setOperations] = useState<BulkOperation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBulkEmail = async () => {
    if (!emailSubject || !emailContent || selectedItems.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields and select recipients',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    const operationId = `email_${Date.now()}`;
    
    const newOperation: BulkOperation = {
      id: operationId,
      type: 'email',
      status: 'running',
      progress: 0,
      total: selectedItems.length,
      completed: 0,
      errors: [],
      created_at: new Date().toISOString()
    };

    setOperations(prev => [...prev, newOperation]);

    try {
      // Simulate bulk email sending
      for (let i = 0; i < selectedItems.length; i++) {
        // In real implementation, this would send actual emails
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setOperations(prev => 
          prev.map(op => 
            op.id === operationId 
              ? { ...op, completed: i + 1, progress: ((i + 1) / selectedItems.length) * 100 }
              : op
          )
        );
      }

      setOperations(prev => 
        prev.map(op => 
          op.id === operationId 
            ? { ...op, status: 'completed' }
            : op
        )
      );

      toast({
        title: 'Bulk Email Sent',
        description: `Successfully sent emails to ${selectedItems.length} recipients`
      });

      setEmailSubject('');
      setEmailContent('');
      setSelectedItems([]);
    } catch (error) {
      setOperations(prev => 
        prev.map(op => 
          op.id === operationId 
            ? { ...op, status: 'failed', errors: ['Failed to send emails'] }
            : op
        )
      );

      toast({
        title: 'Bulk Email Failed',
        description: 'There was an error sending the emails',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedItems.length === 0) {
      toast({
        title: 'No Items Selected',
        description: 'Please select items to update',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Update status for selected items
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .in('id', selectedItems);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Updated ${selectedItems.length} items to ${newStatus}`
      });

      setSelectedItems([]);
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'There was an error updating the status',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkExport = async (format: 'csv' | 'excel') => {
    setIsLoading(true);
    const operationId = `export_${Date.now()}`;
    
    const newOperation: BulkOperation = {
      id: operationId,
      type: 'export',
      status: 'running',
      progress: 0,
      total: 100,
      completed: 0,
      errors: [],
      created_at: new Date().toISOString()
    };

    setOperations(prev => [...prev, newOperation]);

    try {
      // Simulate export progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setOperations(prev => 
          prev.map(op => 
            op.id === operationId 
              ? { ...op, completed: i, progress: i }
              : op
          )
        );
      }

      setOperations(prev => 
        prev.map(op => 
          op.id === operationId 
            ? { ...op, status: 'completed' }
            : op
        )
      );

      // In real implementation, this would trigger a download
      toast({
        title: 'Export Complete',
        description: `Data exported as ${format.toUpperCase()}`
      });
    } catch (error) {
      setOperations(prev => 
        prev.map(op => 
          op.id === operationId 
            ? { ...op, status: 'failed', errors: ['Export failed'] }
            : op
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bulk Operations</h2>
        <p className="text-gray-600">Perform batch operations on multiple items</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Send className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium">Bulk Email</div>
                <div className="text-sm text-gray-500">Send emails to users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">Status Update</div>
                <div className="text-sm text-gray-500">Update order status</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-purple-500" />
              <div>
                <div className="font-medium">Export Data</div>
                <div className="text-sm text-gray-500">Download CSV/Excel</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              <div>
                <div className="font-medium">Bulk Delete</div>
                <div className="text-sm text-gray-500">Remove multiple items</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Email Form */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Email Campaign</CardTitle>
          <CardDescription>Send emails to multiple users at once</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Subject</label>
            <Input
              placeholder="Enter email subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email Content</label>
            <Textarea
              placeholder="Enter email content"
              rows={6}
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Recipients</label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">All Users (1,234)</Badge>
              <Badge variant="secondary">Active Users (890)</Badge>
              <Badge variant="secondary">Vendors (45)</Badge>
            </div>
          </div>

          <Button onClick={handleBulkEmail} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Bulk Email
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
          <CardDescription>Perform actions on selected items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
                <SelectItem value="pending">Mark as Pending</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={() => handleBulkStatusUpdate(bulkAction)}
              disabled={!bulkAction || selectedItems.length === 0 || isLoading}
            >
              Apply to {selectedItems.length} items
            </Button>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleBulkExport('csv')}
              disabled={isLoading}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleBulkExport('excel')}
              disabled={isLoading}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Operation Status */}
      {operations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Operation Status</CardTitle>
            <CardDescription>Track the progress of bulk operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {operations.map((operation) => (
              <div key={operation.id} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {operation.status === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {operation.status === 'failed' && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    {operation.status === 'running' && (
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    )}
                    <span className="font-medium capitalize">
                      {operation.type.replace('_', ' ')}
                    </span>
                  </div>
                  <Badge 
                    variant={
                      operation.status === 'completed' ? 'default' :
                      operation.status === 'failed' ? 'destructive' : 'secondary'
                    }
                  >
                    {operation.status}
                  </Badge>
                </div>

                {operation.status === 'running' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{operation.completed} of {operation.total}</span>
                      <span>{Math.round(operation.progress)}%</span>
                    </div>
                    <Progress value={operation.progress} className="h-2" />
                  </div>
                )}

                {operation.errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {operation.errors.join(', ')}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkOperations;
