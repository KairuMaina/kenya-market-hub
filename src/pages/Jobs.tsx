import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getPublicJobs, JobFilters as JobFiltersType } from '@/integrations/supabase/jobBoardApi';
import MainLayout from '@/components/MainLayout';
import JobCard from '@/components/job-board/JobCard';
import JobFilters from '@/components/job-board/JobFilters';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Job {
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
}

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [filters, setFilters] = useState<JobFiltersType>({
    jobTypes: [],
    remoteOptions: [],
    experienceLevels: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const { toast } = useToast();

  const jobsPerPage = 12;

  useEffect(() => {
    fetchJobs();
  }, [currentPage, filters, search]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const searchFilters = {
        ...filters,
        search: search.trim() || undefined,
      };
      
      const result = await getPublicJobs(currentPage, jobsPerPage, searchFilters);
      setJobs(result.data);
      setTotalPages(result.totalPages);
      setTotalJobs(result.count);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: (error as Error).message, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: JobFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? "bg-gradient-to-r from-orange-500 to-red-600 text-white" : ""}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8 lg:space-y-12">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 sm:p-8 lg:p-12 rounded-xl shadow-2xl animate-fade-in">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Find Your Dream{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Career
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
              Discover amazing job opportunities from top companies across Kenya
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs by title, location, or category..."
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-10 bg-white/90 border-0 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="animate-slide-in-up">
          <JobFilters onFiltersChange={handleFiltersChange} />
        </section>

        {/* Results Summary */}
        <section className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">
              {loading ? 'Loading...' : `${totalJobs} Job${totalJobs !== 1 ? 's' : ''} Found`}
            </h2>
            {totalJobs > 0 && (
              <p className="text-gray-600">
                Showing {((currentPage - 1) * jobsPerPage) + 1} - {Math.min(currentPage * jobsPerPage, totalJobs)} of {totalJobs} results
              </p>
            )}
          </div>
        </section>

        {/* Job Listings */}
        <section className="animate-slide-in-right">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters to find more opportunities.
                </p>
                <Button 
                  onClick={() => {
                    setSearch('');
                    setFilters({ jobTypes: [], remoteOptions: [], experienceLevels: [] });
                    setCurrentPage(1);
                  }}
                  variant="outline"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job, index) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                ))}
              </div>
              
              {renderPagination()}
            </>
          )}
        </section>

        {/* Call to Action */}
        {!loading && jobs.length > 0 && (
          <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 sm:p-8 rounded-xl text-center animate-bounce-in shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Take the Next Step?</h2>
            <p className="text-base sm:text-lg mb-4 sm:mb-6 opacity-90">
              Join thousands of professionals who found their dream jobs through our platform!
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 sm:px-8 py-3"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Search More Jobs
            </Button>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default Jobs;
