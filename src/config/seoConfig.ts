
export const seoConfig = {
  home: {
    title: 'Soko Smart - Kenya\'s Premier Marketplace | Buy, Sell, Rent & Find Services',
    description: 'Kenya\'s leading marketplace for products, real estate, rides, services and jobs. Buy and sell online, find properties in Nairobi, book rides, hire professionals and discover job opportunities across Kenya.',
    keywords: 'marketplace Kenya, online shopping Kenya, buy sell Kenya, property rental Nairobi, taxi booking Kenya, services Kenya, jobs Kenya, Soko Smart',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Soko Smart",
      "url": "https://sokosmart.co.ke",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://sokosmart.co.ke/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  },
  
  shop: {
    title: 'Online Shopping in Kenya | Buy Products & Electronics - Soko Smart',
    description: 'Shop online in Kenya for electronics, fashion, home & garden, automotive parts and more. Best prices, quality products, secure payments and fast delivery across Kenya.',
    keywords: 'online shopping Kenya, buy electronics Kenya, fashion Kenya, home garden Kenya, automotive parts Kenya, best prices Kenya',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "Soko Smart Store",
      "description": "Online marketplace for products in Kenya"
    }
  },

  realEstate: {
    title: 'Property for Sale & Rent in Kenya | Houses, Apartments, Land - Soko Smart',
    description: 'Find property for sale and rent in Kenya. Houses, apartments, land and commercial properties in Nairobi, Mombasa, Kisumu and other cities. Browse listings with photos and contact owners directly.',
    keywords: 'property for sale Kenya, houses for rent Nairobi, apartments Kenya, land for sale Kenya, real estate Kenya, property rental Kenya',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Soko Smart Real Estate",
      "areaServed": "Kenya"
    }
  },

  rides: {
    title: 'Book Rides in Kenya | Taxi, Matatu & Car Booking App - Soko Smart',
    description: 'Book affordable rides in Kenya. Find taxis, matatus, private cars and motorcycles for safe, reliable transportation in Nairobi, Mombasa and other Kenyan cities.',
    keywords: 'taxi booking Kenya, matatu booking, ride sharing Kenya, transport Kenya, car hire Kenya, motorcycle taxi Kenya',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      "name": "Soko Smart Rides",
      "areaServed": "Kenya"
    }
  },

  services: {
    title: 'Find Professional Services in Kenya | Hire Experts - Soko Smart',
    description: 'Find and hire professional service providers in Kenya. Plumbers, electricians, cleaners, tutors, mechanics and more. Verified professionals, fair prices, quality service.',
    keywords: 'services Kenya, hire professionals Kenya, plumber Nairobi, electrician Kenya, cleaner Kenya, tutor Kenya, mechanic Kenya',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Soko Smart Services",
      "serviceType": "Professional Services Marketplace"
    }
  },

  jobs: {
    title: 'Jobs in Kenya | Find Employment Opportunities - Soko Smart',
    description: 'Find job opportunities in Kenya. Browse latest vacancies, apply online and connect with employers. Jobs in Nairobi, Mombasa, Kisumu and across Kenya.',
    keywords: 'jobs Kenya, employment Kenya, careers Kenya, job vacancies Kenya, work opportunities Kenya, job search Kenya',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Soko Smart"
      }
    }
  }
};

export const cityPages = {
  nairobi: {
    title: 'Nairobi Marketplace | Buy, Sell, Rent & Find Services - Soko Smart',
    description: 'Nairobi\'s premier marketplace. Buy and sell products, find property rentals, book rides, hire services and discover jobs in Nairobi, Kenya.',
    keywords: 'Nairobi marketplace, buy sell Nairobi, property rental Nairobi, services Nairobi, jobs Nairobi, online shopping Nairobi'
  },
  mombasa: {
    title: 'Mombasa Marketplace | Buy, Sell, Rent & Find Services - Soko Smart',
    description: 'Mombasa\'s leading marketplace. Shop online, find properties, book transportation, hire professionals and discover employment opportunities in Mombasa.',
    keywords: 'Mombasa marketplace, buy sell Mombasa, property Mombasa, services Mombasa, jobs Mombasa, online shopping Mombasa'
  },
  kisumu: {
    title: 'Kisumu Marketplace | Buy, Sell, Rent & Find Services - Soko Smart',
    description: 'Kisumu\'s trusted marketplace for products, properties, rides, services and jobs. Connect with local buyers, sellers and service providers.',
    keywords: 'Kisumu marketplace, buy sell Kisumu, property Kisumu, services Kisumu, jobs Kisumu, online shopping Kisumu'
  }
};
