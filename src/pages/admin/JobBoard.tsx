import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getJobs, deleteJob, createJob, updateJob } from '@/integrations/supabase/jobBoardApi';
import { Job } from '@/types/job';
import MainLayout from '@/components/MainLayout';

const JobBoard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getJobs();
      // Handle both array and paginated response formats
      const jobData = Array.isArray(response) ? response : response?.data || [];
      // Ensure all jobs have required fields
      const formattedJobs = jobData.map((job: any) => ({
        ...job,
        location: job.location || 'Not specified'
      }));
      setJobs(formattedJobs);
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    (job.location && job.location.toLowerCase().includes(search.toLowerCase())) ||
    job.category.toLowerCase().includes(search.toLowerCase())
  );

  const [editingJob, setEditingJob] = React.useState<Job | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    location: '',
    category: '',
    salary: '',
    status: 'open',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      category: '',
      salary: '',
      status: 'open',
    });
    setEditingJob(null);
  };

  const handleAddJob = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditJob = (job: Job) => {
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location || '',
      category: job.category,
      salary: job.salary,
      status: job.status,
    });
    setEditingJob(job);
    setShowForm(true);
  };

  const handleDeleteJob = async (id: number) => {
    try {
      await deleteJob(id);
      toast({ title: 'Success', description: 'Job deleted successfully' });
      fetchJobs();
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await updateJob(editingJob.id, formData);
        toast({ title: 'Success', description: 'Job updated successfully' });
      } else {
        await createJob(formData);
        toast({ title: 'Success', description: 'Job created successfully' });
      }
      setShowForm(false);
      fetchJobs();
      resetForm();
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Job Board Management</h1>
        <div className="mb-4 flex justify-between items-center">
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleAddJob}>
            Add Job
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleFormSubmit} className="mb-6 p-4 border rounded-md bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Location</label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <Input
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Salary</label>
                <Input
                  name="salary"
                  value={formData.salary}
                  onChange={handleFormChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button type="submit">
                {editingJob ? 'Update Job' : 'Create Job'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); resetForm(); }}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No jobs found.</TableCell>
              </TableRow>
            ) : (
              filteredJobs.map(job => (
                <TableRow key={job.id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.location || 'Not specified'}</TableCell>
                  <TableCell>{job.category}</TableCell>
                  <TableCell>{job.salary}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="mr-2" onClick={() => handleEditJob(job)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteJob(job.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default JobBoard;
