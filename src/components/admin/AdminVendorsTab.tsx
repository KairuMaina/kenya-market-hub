
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminVendor {
  id: string;
  business_name: string;
  business_email?: string;
  verification_status: string;
  products_count?: number;
  total_revenue?: number;
}

interface AdminVendorsTabProps {
  adminVendorsData: AdminVendor[] | undefined;
  adminVendorsLoading: boolean;
  adminVendorsError: Error | null;
  vendorSearchTerm: string;
  setVendorSearchTerm: (term: string) => void;
  setVendorPage: (page: number) => void;
}

const AdminVendorsTab: React.FC<AdminVendorsTabProps> = ({
  adminVendorsData,
  adminVendorsLoading,
  adminVendorsError,
  vendorSearchTerm,
  setVendorSearchTerm,
  setVendorPage
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Vendors</CardTitle>
            <CardDescription>
              View and manage all vendor profiles. New vendors will be listed here as soon as they are approved.
            </CardDescription>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                placeholder="Search vendors..."
                value={vendorSearchTerm}
                onChange={(e) => {
                  setVendorSearchTerm(e.target.value);
                  setVendorPage(1);
                }}
                className="pl-9 w-64 h-9 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                style={{ paddingLeft: 36 }}
              />
              <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {adminVendorsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-2 text-orange-500">Loading vendors...</span>
          </div>
        ) : adminVendorsError ? (
          <div className="text-red-500 bg-red-50 p-4 rounded">
            Error loading vendors: {adminVendorsError.message}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-orange-50">
                  <th className="px-4 py-2 text-left font-semibold">Business Name</th>
                  <th className="px-4 py-2 text-left font-semibold">Email</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                  <th className="px-4 py-2 font-semibold">Products</th>
                  <th className="px-4 py-2 font-semibold">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {adminVendorsData && adminVendorsData.length > 0 ? adminVendorsData.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-orange-50 transition-all">
                    <td className="px-4 py-2 font-medium">{vendor.business_name}</td>
                    <td className="px-4 py-2">{vendor.business_email || 'N/A'}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        vendor.verification_status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : vendor.verification_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {vendor.verification_status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{vendor.products_count || 0}</td>
                    <td className="px-4 py-2 text-green-700 font-semibold">
                      KSh {Number(vendor.total_revenue || 0).toLocaleString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                      No vendors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminVendorsTab;
