
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Building, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: {
    id: number;
    title: string;
    description: string;
    location?: string;
    category?: string;
    salary?: string;
    job_type?: string;
    remote_option?: string;
    experience_level?: string;
    company_name?: string;
    created_at: string;
  };
  className?: string;
  style?: React.CSSProperties;
}

const JobCard: React.FC<JobCardProps> = ({ job, className = '', style }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <Card 
      className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg overflow-hidden ${className}`}
      style={style}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-1 group-hover:text-orange-600 transition-colors">
              {job.title}
            </CardTitle>
            {job.company_name && (
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <Building className="h-4 w-4 mr-1" />
                {job.company_name}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(job.created_at)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {job.job_type && (
            <Badge variant="outline" className="text-xs">
              {job.job_type}
            </Badge>
          )}
          {job.remote_option && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {job.remote_option}
            </Badge>
          )}
          {job.experience_level && (
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              <Users className="h-3 w-3 mr-1" />
              {job.experience_level}
            </Badge>
          )}
          {job.category && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              {job.category}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {job.description.length > 150 
            ? `${job.description.substring(0, 150)}...` 
            : job.description}
        </p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {job.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </div>
            )}
            {job.salary && (
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {job.salary}
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Link to={`/jobs/${job.id}`} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white transition-all duration-300 hover:scale-105">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
