
import React from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import ServiceProviderRegistration from '@/components/ServiceProviderRegistration';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ServiceProviderRegistrationPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const serviceType = queryParams.get('type') || 'vendor';

    return (
        <MainLayout>
            <div className="container mx-auto py-8">
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bold">Service Provider Registration</CardTitle>
                  <CardDescription>
                    Fill out the form below to apply to become a service provider on our platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ServiceProviderRegistration initialTab={serviceType} />
                </CardContent>
              </Card>
            </div>
        </MainLayout>
    );
};

export default ServiceProviderRegistrationPage;
