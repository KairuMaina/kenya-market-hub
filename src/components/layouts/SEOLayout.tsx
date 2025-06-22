
import React from 'react';
import SEOManager from '@/components/seo/SEOManager';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import SitemapGenerator from '@/components/seo/SitemapGenerator';

interface SEOLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product' | 'business.business';
  structuredData?: any;
  canonical?: string;
  showBreadcrumbs?: boolean;
  breadcrumbItems?: Array<{ label: string; href: string }>;
}

const SEOLayout: React.FC<SEOLayoutProps> = ({
  children,
  title,
  description,
  keywords,
  image,
  type,
  structuredData,
  canonical,
  showBreadcrumbs = true,
  breadcrumbItems
}) => {
  return (
    <>
      <SEOManager
        title={title}
        description={description}
        keywords={keywords}
        image={image}
        type={type}
        structuredData={structuredData}
        canonical={canonical}
      />
      <SitemapGenerator />
      
      {showBreadcrumbs && (
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-2">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>
      )}
      
      {children}
    </>
  );
};

export default SEOLayout;
