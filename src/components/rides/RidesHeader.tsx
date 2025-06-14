
import React from 'react';
import { Navigation } from 'lucide-react';

const RidesHeader = () => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Navigation className="h-8 w-8" />
            Ride Services
          </h1>
          <p className="text-orange-100 mt-2">
            Book rides across Kenya with our network of verified drivers
          </p>
        </div>
      </div>
    </div>
  );
};

export default RidesHeader;
