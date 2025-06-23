
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  alt="Sokko Smart Logo" 
                  src="/lovable-uploads/563ee6fb-f94f-43f3-a4f3-a61873a1b491.png" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Sokko Smart</h3>
                <p className="text-gray-400 text-sm">Kenya's Smart Marketplace</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Your one-stop digital marketplace for everything in Kenya. 
              From shopping to services, we connect you to the best Kenya has to offer.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/shop" className="hover:text-orange-400 transition-colors">Shop</a></li>
              <li><a href="/services" className="hover:text-orange-400 transition-colors">Services</a></li>
              <li><a href="/real-estate" className="hover:text-orange-400 transition-colors">Real Estate</a></li>
              <li><a href="/events" className="hover:text-orange-400 transition-colors">Events</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Sokko Smart by Milleast.tech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
