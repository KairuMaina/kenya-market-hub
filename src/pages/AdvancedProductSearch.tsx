
import React from 'react';
import MainLayout from '@/components/MainLayout';
import AdvancedSearch from '@/components/AdvancedSearch';

const AdvancedProductSearch = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Product Search</h1>
          <p className="text-gray-600">Find exactly what you're looking for with our advanced search filters</p>
        </div>
        
        <AdvancedSearch />
      </div>
    </MainLayout>
  );
};

export default AdvancedProductSearch;
