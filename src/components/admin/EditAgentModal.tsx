
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AdminAgent, useUpdateAgent } from '@/hooks/useAdminAgents';

interface EditAgentModalProps {
  agent: AdminAgent | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditAgentModal = ({ agent, isOpen, onClose, onSuccess }: EditAgentModalProps) => {
  const [formData, setFormData] = useState<Partial<AdminAgent>>({});
  const updateAgent = useUpdateAgent();
  
  useEffect(() => {
    if (agent) {
      setFormData(agent);
    }
  }, [agent]);

  if (!agent) return null;

  const handleInputChange = (field: keyof Omit<AdminAgent, 'id' | 'user_id' | 'created_at' | 'full_name'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAgent.mutate(formData as AdminAgent, {
      onSuccess: () => {
        onSuccess();
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
          <DialogDescription>
            Update details for {agent.full_name || agent.email}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agency_name">Agency Name</Label>
              <Input
                id="agency_name"
                value={formData.agency_name || ''}
                onChange={(e) => handleInputChange('agency_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license_number">License Number</Label>
              <Input
                id="license_number"
                value={formData.license_number || ''}
                onChange={(e) => handleInputChange('license_number', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_verified"
              checked={formData.is_verified || false}
              onCheckedChange={(checked) => handleInputChange('is_verified', checked)}
            />
            <Label htmlFor="is_verified">Verified</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active || false}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateAgent.isPending}>
              {updateAgent.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAgentModal;
