
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useStartBusinessConversation } from '@/hooks/useChatForums';
import { MessageCircle } from 'lucide-react';

interface BusinessContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  businessId: string;
}

const BusinessContactModal = ({ isOpen, onClose, businessName, businessId }: BusinessContactModalProps) => {
  const [message, setMessage] = useState('');
  const startConversation = useStartBusinessConversation();

  const handleSendMessage = () => {
    if (message.trim()) {
      startConversation.mutate({
        businessId,
        initialMessage: message
      }, {
        onSuccess: () => {
          setMessage('');
          onClose();
        }
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Contact {businessName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Send a message to start a conversation with {businessName}.
          </p>
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || startConversation.isPending}
            >
              {startConversation.isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessContactModal;
