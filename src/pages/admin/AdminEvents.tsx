
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  MapPin, 
  Clock, 
  Users,
  Ticket,
  TrendingUp,
  DollarSign
} from 'lucide-react';

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
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'pending review': return 'bg-orange-100 text-orange-800';
      case 'under review': return 'bg-purple-100 text-purple-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Events & Ticketing Management</h1>
          <p className="text-gray-600">Manage events, approvals, and ticket sales</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-orange-200">
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
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 border border-orange-200">
            {['events', 'requests', 'sales'].map((tab) => (
              <Button
                key={tab}
                variant={selectedTab === tab ? 'default' : 'ghost'}
                onClick={() => setSelectedTab(tab)}
                className={selectedTab === tab 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'hover:bg-orange-50'
                }
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Content based on selected tab */}
        <Card className="border-orange-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
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
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedTab === 'events' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-orange-200">
                      <th className="text-left py-3 px-4">Event</th>
                      <th className="text-left py-3 px-4">Organizer</th>
                      <th className="text-left py-3 px-4">Date & Time</th>
                      <th className="text-left py-3 px-4">Location</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Attendance</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id} className="border-b border-orange-100">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-gray-600">{event.category}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{event.organizer}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600">{event.time}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{event.location}</td>
                        <td className="py-3 px-4">
                          {event.price === 0 ? 'FREE' : `KSh ${event.price.toLocaleString()}`}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{event.attendees}/{event.capacity}</p>
                            <p className="text-sm text-gray-600">{event.ticketsSold} tickets sold</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedTab === 'requests' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-orange-200">
                      <th className="text-left py-3 px-4">Event Title</th>
                      <th className="text-left py-3 px-4">Organizer</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Submitted Date</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventRequests.map((request) => (
                      <tr key={request.id} className="border-b border-orange-100">
                        <td className="py-3 px-4 font-medium">{request.title}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{request.organizer}</p>
                            <p className="text-sm text-gray-600">{request.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{request.category}</td>
                        <td className="py-3 px-4">{new Date(request.submittedDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedTab === 'sales' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-orange-200">
                      <th className="text-left py-3 px-4">Event</th>
                      <th className="text-left py-3 px-4">Buyer</th>
                      <th className="text-left py-3 px-4">Ticket Type</th>
                      <th className="text-left py-3 px-4">Quantity</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Purchase Date</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticketSales.map((sale) => (
                      <tr key={sale.id} className="border-b border-orange-100">
                        <td className="py-3 px-4 font-medium">{sale.eventTitle}</td>
                        <td className="py-3 px-4">{sale.buyer}</td>
                        <td className="py-3 px-4">{sale.ticketType}</td>
                        <td className="py-3 px-4">{sale.quantity}</td>
                        <td className="py-3 px-4">KSh {sale.amount.toLocaleString()}</td>
                        <td className="py-3 px-4">{new Date(sale.purchaseDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(sale.status)}>
                            {sale.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            View Receipt
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminEvents;
