import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EmployerSignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('employers').insert([
        {
          company_name: formData.companyName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          description: formData.description,
          approved: false,
          created_at: new Date().toISOString(),
        },
      ]);
      if (error) throw error;
      toast({ title: 'Success', description: 'Employer sign-up submitted. Await admin approval.' });
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        description: '',
      });
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Employer Sign-Up</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Company Name</label>
        <Input
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Contact Name</label>
        <Input
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Phone</label>
        <Input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Website</label>
        <Input
          name="website"
          value={formData.website}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full border rounded-md p-2"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default EmployerSignUp;
