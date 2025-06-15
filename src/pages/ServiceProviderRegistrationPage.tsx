
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import GenericServiceProviderRegistrationForm from '@/components/GenericServiceProviderRegistrationForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ServiceProviderRegistrationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const serviceType = queryParams.get('type');

    if (!serviceType || serviceType === 'vendor') {
        return (
            <MainLayout>
                <div className="container mx-auto py-8">
                    <Card className="max-w-4xl mx-auto">
                        <CardHeader>
                            <CardTitle className="text-2xl md:text-3xl font-bold">Application Unavailable</CardTitle>
                            <CardDescription>
                                The application process for this service type is not available via this form.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>For vendor applications, please use the "Apply Now" button in the Service Provider Hub.</p>
                            <Button onClick={() => navigate('/service-provider-hub')}>
                                Back to Service Provider Hub
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </MainLayout>
        );
    }

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
                  <GenericServiceProviderRegistrationForm serviceType={serviceType} />
                </CardContent>
              </Card>
            </div>
        </MainLayout>
    );
};

export default ServiceProviderRegistrationPage;
