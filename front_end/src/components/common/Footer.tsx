import React from 'react';

const Footer = () => (
  <footer className="bg-gray-800 text-white pt-12 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">About Hospitopia Hub</h3>
          <p className="text-gray-300">
            We provide the best hotel booking experience with a wide range of options and competitive prices.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
            <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
            <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
            <li><a href="/hotels" className="text-gray-300 hover:text-white">Browse Hotels</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <address className="text-gray-300 not-italic">
            <p>123 Booking Street</p>
            <p>Hotel District, 10000</p>
            <p className="mt-2">Email: info@hospitopia.com</p>
            <p>Phone: +1 234 567 890</p>
          </address>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
        <p>&copy; {new Date().getFullYear()} Hospitopia Hub. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer; 