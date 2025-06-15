
-- Phase 1: Data Cleanup - Deleting all test and mock data

-- Clear product-related data
DELETE FROM public.reviews;
DELETE FROM public.order_items;
DELETE FROM public.orders;
DELETE FROM public.products;

-- Clear vendor-related data
DELETE FROM public.vendors;
DELETE FROM public.vendor_applications;
DELETE FROM public.vendor_coupon_requests;

-- Clear service provider data
DELETE FROM public.service_bookings;
DELETE FROM public.service_provider_profiles;

-- Clear real estate data
DELETE FROM public.property_viewings;
DELETE FROM public.property_inquiries;
DELETE FROM public.properties;
DELETE FROM public.real_estate_agents;

-- Clear driver and ride data
DELETE FROM public.driver_ride_requests;
DELETE FROM public.rides;
DELETE FROM public.drivers;

