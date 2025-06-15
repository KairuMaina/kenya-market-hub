
import React from 'react';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { useProducts } from '@/hooks/useProducts';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

const VendorStore = () => {
  const { data: vendorProfile } = useMyVendorProfile();
  const { data: products, isLoading } = useProducts({ vendorId: vendorProfile?.id });

  return (
    <div className="space-y-6">
      {vendorProfile && (
        <header className="mb-6">
          <h1 className="text-3xl font-bold">{vendorProfile.business_name} Store</h1>
          <div className="text-muted-foreground">{vendorProfile.business_description}</div>
          <div className="text-sm">{vendorProfile.business_email}</div>
        </header>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <Card><CardContent>Loading products...</CardContent></Card>
        ) : products?.length === 0 ? (
          <span>No products in your store yet.</span>
        ) : (
          products?.map(product => (
            <Card key={product.id}>
              <CardContent>
                <CardTitle>{product.name}</CardTitle>
                <div className="text-sm">{product.category}</div>
                <div className="text-lg font-bold mt-2">KSH {product.price}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorStore;
