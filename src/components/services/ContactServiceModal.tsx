
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ContactServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any;
}

const ContactServiceModal: React.FC<ContactServiceModalProps> = ({ isOpen, onClose, service }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate sending message
    toast({
      title: 'Message Sent',
      description: 'Your message has been sent to the service provider. They will contact you soon.'
    });

    onClose();
    setMessage('');
    setSenderName('');
    setSenderEmail('');
    setSenderPhone('');
  };

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-orange-500" />
            Contact {service.business_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Service Provider Contact Info */}
          <div className="bg-orange-50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-gray-900">{service.business_name}</h3>
            <p className="text-sm text-gray-600 capitalize">{service.provider_type}</p>
            
            {service.phone_number && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-orange-500" />
                <span>{service.phone_number}</span>
              </div>
            )}
            
            {service.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-orange-500" />
                <span>{service.email}</span>
              </div>
            )}
            
            {service.location_address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span className="text-xs">{service.location_address}</span>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="sender_name">Your Name</Label>
                <Input
                  id="sender_name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender_phone">Phone</Label>
                <Input
                  id="sender_phone"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="+254..."
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sender_email">Email</Label>
              <Input
                id="sender_email"
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="border-orange-200 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I'm interested in your services..."
                rows={4}
                required
                className="border-orange-200 focus:border-orange-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactServiceModal;
