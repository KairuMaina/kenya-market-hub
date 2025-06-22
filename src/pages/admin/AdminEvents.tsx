
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calendar, 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  Users,
  Ticket,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

const AdminEvents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('events');

  const stats = [
    {
      title: 'Total Events',
      value: '89',
      change: '+15%',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Tickets Sold',
      value: '1,456',
      change: '+28%',
      icon: Ticket,
      color: 'text-orange-600'
    },
    {
      title: 'Total Attendees',
      value: '3,247',
      change: '+22%',
      icon: Users,
      color: 'text-red-600'
    },
    {
      title: 'Revenue This Month',
      value: 'KSh 890,000',
      change: '+35%',
      icon: DollarSign,
      color: 'text-yellow-600'
    }
  ];

  const events = [
    {
      id: 1,
      title: 'Jazz Night at The Alchemist',
      organizer: 'The Alchemist',
      category: 'Concert',
      date: '2024-06-20',
      time: '19:00',
      location: 'Westlands',
      price: 2500,
      attendees: 145,
      capacity: 200,
      status: 'Active',
      ticketsSold: 145
    },
    {
      id: 2,
      title: 'Tech Startup Conference 2024',
      organizer: 'TechHub Kenya',
      category: 'Conference',
      date: '2024-06-25',
      time: '09:00',
      location: 'KICC',
      price: 0,
      attendees: 320,
      capacity: 500,
      status: 'Active',
      ticketsSold: 320
    },
    {
      id: 3,
      title: 'Churchill Comedy Night',
      organizer: 'Churchill Show',
      category: 'Comedy',
      date: '2024-06-22',
      time: '20:00',
      location: 'Louis Leakey Auditorium',
      price: 1500,
      attendees: 89,
      capacity: 150,
      status: 'Pending',
      ticketsSold: 89
    }
  ];

  const eventRequests = [
    {
      id: 1,
      title: 'Art Exhibition - Modern Kenya',
      organizer: 'Art Gallery Nairobi',
      category: 'Exhibition',
      submittedDate: '2024-06-15',
      status: 'Pending Review',
      email: 'info@artgallery.co.ke'
    },
    {
      id: 2,
      title: 'Business Networking Breakfast',
      organizer: 'Kenya Business Network',
      category: 'Networking',
      submittedDate: '2024-06-14',
      status: 'Under Review',
      email: 'events@kbn.co.ke'
    }
  ];

  const ticketSales = [
    {
      id: 1,
      eventTitle: 'Jazz Night at The Alchemist',
      buyer: 'John Doe',
      ticketType: 'VIP',
      quantity: 2,
      amount: 5000,
      purchaseDate: '2024-06-18',
      status: 'Confirmed'
    },
    {
      id: 2,
      eventTitle: 'Churchill Comedy Night',
      buyer: 'Mary Smith',
      ticketType: 'Regular',
      quantity: 1,
      amount: 1500,
      purchaseDate: '2024-06-17',
      status: 'Confirmed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'pending review': return 'outline';
      case 'under review': return 'outline';
      case 'confirmed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events & Ticketing Management</h1>
            <p className="text-gray-600">Manage events, approvals, and ticket sales</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 border">
          {['events', 'requests', 'sales'].map((tab) => (
            <Button
              key={tab}
              variant={selectedTab === tab ? 'default' : 'ghost'}
              onClick={() => setSelectedTab(tab)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Content based on selected tab */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl capitalize">
                {selectedTab === 'events' && 'Published Events'}
                {selectedTab === 'requests' && 'Event Approval Requests'}
                {selectedTab === 'sales' && 'Ticket Sales'}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                {selectedTab === 'events' && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedTab === 'events' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-600">{event.category}</p>
                        </div>
                      </TableCell>
                      <TableCell>{event.organizer}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">{event.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        {event.price === 0 ? 'FREE' : `KSh ${event.price.toLocaleString()}`}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.attendees}/{event.capacity}</p>
                          <p className="text-sm text-gray-600">{event.ticketsSold} tickets sold</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {selectedTab === 'requests' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Title</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.title}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.organizer}</p>
                          <p className="text-sm text-gray-600">{request.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{request.category}</TableCell>
                      <TableCell>{new Date(request.submittedDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" className="text-green-600">
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            Reject
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {selectedTab === 'sales' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Ticket Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.eventTitle}</TableCell>
                      <TableCell>{sale.buyer}</TableCell>
                      <TableCell>{sale.ticketType}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell>KSh {sale.amount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(sale.purchaseDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(sale.status)}>
                          {sale.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ModernAdminLayout>
  );
};

export default AdminEvents;
