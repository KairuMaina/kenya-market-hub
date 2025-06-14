
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useVendorApplication } from '@/hooks/useVendors';

interface VendorApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VendorApplicationModal = ({ open, onOpenChange }: VendorApplicationModalProps) => {
  const [formData, setFormData] = useState({
    business_name: '',
    business_description: '',
    business_address: '',
    business_phone: '',
    business_email: '',
    business_license: '',
    tax_id: ''
  });

  const vendorApplication = useVendorApplication();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    vendorApplication.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({
          business_name: '',
          business_description: '',
          business_address: '',
          business_phone: '',
          business_email: '',
          business_license: '',
          tax_id: ''
        });
      }
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply to Become a Vendor</DialogTitle>
          <DialogDescription>
            Fill out this form to apply to sell your products on our marketplace.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business_name">Business Name *</Label>
            <Input
              id="business_name"
              value={formData.business_name}
              onChange={(e) => handleChange('business_name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_email">Business Email *</Label>
            <Input
              id="business_email"
              type="email"
              value={formData.business_email}
              onChange={(e) => handleChange('business_email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_phone">Business Phone *</Label>
            <Input
              id="business_phone"
              value={formData.business_phone}
              onChange={(e) => handleChange('business_phone', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_address">Business Address *</Label>
            <Textarea
              id="business_address"
              value={formData.business_address}
              onChange={(e) => handleChange('business_address', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_description">Business Description *</Label>
            <Textarea
              id="business_description"
              value={formData.business_description}
              onChange={(e) => handleChange('business_description', e.target.value)}
              placeholder="Tell us about your business, what products you sell, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_license">Business License Number</Label>
            <Input
              id="business_license"
              value={formData.business_license}
              onChange={(e) => handleChange('business_license', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax_id">Tax ID</Label>
            <Input
              id="tax_id"
              value={formData.tax_id}
              onChange={(e) => handleChange('tax_id', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={vendorApplication.isPending}
            >
              {vendorApplication.isPending ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VendorApplicationModal;
