import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useServiceProviderRegistration, ServiceProviderRegistrationData } from '@/hooks/useServiceProviderRegistration';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  business_name: z.string().min(2, { message: 'Business name must be at least 2 characters.' }),
  business_description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  business_address: z.string().min(5, { message: 'Address is required.' }),
  business_phone: z.string().min(10, { message: 'A valid phone number is required.' }),
  business_email: z.string().email({ message: 'A valid email is required.' }),
});

interface GenericServiceProviderRegistrationFormProps {
  serviceType: string;
}

const GenericServiceProviderRegistrationForm = ({ serviceType }: GenericServiceProviderRegistrationFormProps) => {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useServiceProviderRegistration();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: '',
      business_description: '',
      business_address: '',
      business_phone: '',
      business_email: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload: ServiceProviderRegistrationData = {
      business_name: values.business_name,
      business_description: values.business_description,
      business_address: values.business_address,
      business_phone: values.business_phone,
      business_email: values.business_email,
      service_type: serviceType,
    };
    register(payload, {
      onSuccess: () => {
        navigate('/service-provider-hub');
      }
    });
  }

  const formattedServiceType = serviceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div>
        <h3 className="text-lg font-medium mb-4">Apply as {formattedServiceType}</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Acme Services" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="business_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about your business" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="business_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 123 Main St, Nairobi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="business_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 0712345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="business_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Email</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. contact@acmeservices.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </Form>
    </div>
  );
};

export default GenericServiceProviderRegistrationForm;
