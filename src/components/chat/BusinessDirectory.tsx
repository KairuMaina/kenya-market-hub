
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Phone, Mail, MessageSquare, Search, Building } from 'lucide-react';
import { useServiceProviders } from '@/hooks/useServiceProviders';

interface BusinessDirectoryProps {
  onStartChat: (conversationId: string) => void;
}

const BusinessDirectory: React.FC<BusinessDirectoryProps> = ({ onStartChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Mock data for now since we don't have a specific business directory
  const mockBusinesses = [
    {
      id: '1',
      name: 'Tech Solutions Ltd',
      category: 'Technology',
      description: 'Professional IT services and consulting',
      location: 'Nairobi, Kenya',
      phone: '+254 700 123 456',
      email: 'info@techsolutions.ke',
      avatar_url: null,
      isOnline: true
    },
    {
      id: '2',
      name: 'Green Gardens',
      category: 'Landscaping',
      description: 'Beautiful garden design and maintenance',
      location: 'Mombasa, Kenya',
      phone: '+254 700 789 012',
      email: 'hello@greengardens.ke',
      avatar_url: null,
      isOnline: false
    }
  ];

  const categories = ['all', 'Technology', 'Landscaping', 'Construction', 'Healthcare', 'Education'];

  const filteredBusinesses = mockBusinesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || business.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartChat = async (businessId: string) => {
    // Create a conversation ID (in real implementation, this would create a conversation)
    const conversationId = `conv_${businessId}_${Date.now()}`;
    onStartChat(conversationId);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Business List */}
      <div className="grid gap-4">
        {filteredBusinesses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms.' : 'No businesses available at the moment.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={business.avatar_url || undefined} />
                      <AvatarFallback>
                        {business.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{business.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{business.category}</Badge>
                        <div className={`w-2 h-2 rounded-full ${
                          business.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-sm text-gray-600">
                          {business.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleStartChat(business.id)}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="mb-4">
                  {business.description}
                </CardDescription>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{business.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{business.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{business.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BusinessDirectory;
