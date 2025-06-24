
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl">Soko Smart</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your one-stop digital marketplace for products, services, properties, and more. 
              Connecting communities across Kenya.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Products</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Services</Link></li>
              <li><Link to="/properties" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Properties</Link></li>
              <li><Link to="/rides" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Rides</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/vendor-registration" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Become a Vendor</Link></li>
              <li><Link to="/driver-registration" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Drive with Us</Link></li>
              <li><Link to="/service-provider-registration" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Offer Services</Link></li>
              <li><Link to="/property-owner-registration" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">List Property</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Support</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-orange-500" />
                <span className="text-gray-400 text-sm">support@sokosmart.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-orange-500" />
                <span className="text-gray-400 text-sm">+254 700 000 000</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-orange-500 mt-0.5" />
                <span className="text-gray-400 text-sm">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Soko Smart. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
