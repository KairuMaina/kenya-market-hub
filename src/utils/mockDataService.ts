
// Temporary mock data service - will be replaced with Supabase integration
export const mockDataService = {
  // Products
  getProducts: async (limit?: number) => {
    const products = [
      {
        id: '1',
        name: 'Smartphone Pro Max',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
        category: 'Electronics',
        rating: 4.8,
        inStock: true
      },
      {
        id: '2',
        name: 'Wireless Headphones',
        price: 8500,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        category: 'Electronics',
        rating: 4.5,
        inStock: true
      },
      {
        id: '3',
        name: 'Designer Handbag',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
        category: 'Fashion',
        rating: 4.7,
        inStock: true
      }
    ];
    return limit ? products.slice(0, limit) : products;
  },

  // Events
  getEvents: async (limit?: number) => {
    const events = [
      {
        id: '1',
        title: 'Tech Conference Nairobi 2024',
        date: '2024-07-15',
        location: 'KICC, Nairobi',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        category: 'Technology'
      },
      {
        id: '2',
        title: 'Jazz Night at The Alchemist',
        date: '2024-07-20',
        location: 'Westlands, Nairobi',
        price: 1500,
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
        category: 'Music'
      }
    ];
    return limit ? events.slice(0, limit) : events;
  },

  // Jobs
  getJobs: async (limit?: number) => {
    const jobs = [
      {
        id: '1',
        title: 'Software Developer',
        company: 'Tech Solutions Kenya',
        location: 'Nairobi',
        salary: 80000,
        type: 'Full-time',
        posted: '2024-06-15'
      },
      {
        id: '2',
        title: 'Marketing Manager',
        company: 'Digital Agency Ltd',
        location: 'Mombasa',
        salary: 65000,
        type: 'Full-time',
        posted: '2024-06-16'
      }
    ];
    return limit ? jobs.slice(0, limit) : jobs;
  },

  // Properties
  getProperties: async (limit?: number) => {
    const properties = [
      {
        id: '1',
        title: '3BR Apartment in Kilimani',
        price: 4500000,
        location: 'Kilimani, Nairobi',
        bedrooms: 3,
        bathrooms: 2,
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
        type: 'Apartment'
      },
      {
        id: '2',
        title: '4BR Villa in Karen',
        price: 12000000,
        location: 'Karen, Nairobi',
        bedrooms: 4,
        bathrooms: 3,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
        type: 'Villa'
      }
    ];
    return limit ? properties.slice(0, limit) : properties;
  }
};
