
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import HeroSection from '@/components/shared/HeroSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Building,
  Clock,
  Users,
  TrendingUp,
  Filter
} from 'lucide-react';

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Mock data for jobs - replace with real data from your backend
  const jobs = [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Solutions Ltd',
      location: 'Nairobi',
      type: 'Full-time',
      salary: 'KSh 150,000 - 250,000',
      category: 'Technology',
      postedDate: '2 days ago',
      description: 'We are looking for a skilled software engineer to join our dynamic team...',
      requirements: ['Bachelor\'s degree in Computer Science', '3+ years experience', 'React, Node.js'],
      logo: '/company-logos/tech-solutions.png'
    },
    // Add more mock jobs here
  ];

  const categories = [
    'Technology',
    'Healthcare', 
    'Finance',
    'Education',
    'Marketing',
    'Sales',
    'Engineering',
    'Administration'
  ];

  const locations = [
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Thika',
    'Malindi'
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <HeroSection
          title="Find Your Dream Job"
          subtitle="Thousands of opportunities await"
          description="Connect with top employers across Kenya and advance your career"
          imageUrl="photo-1521737604893-d14cc237f11d"
          className="mb-8"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs, companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">1,234</div>
                <div className="text-sm text-gray-600">Active Jobs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Building className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">567</div>
                <div className="text-sm text-gray-600">Companies</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">12,345</div>
                <div className="text-sm text-gray-600">Job Seekers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">89%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs Grid */}
          <div className="space-y-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                              <Badge variant="outline">{job.type}</Badge>
                            </div>
                            <p className="text-lg text-blue-600 font-medium mb-2">{job.company}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                <span>{job.salary}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{job.postedDate}</span>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 text-sm line-clamp-2">{job.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                        <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                          Apply Now
                        </Button>
                        <Button variant="outline" size="sm">
                          Save Job
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No jobs found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Jobs;
