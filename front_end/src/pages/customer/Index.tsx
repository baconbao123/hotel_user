import CustomerLayout from '@/layouts/CustomerLayout';
import PageWrapper from '@/components/common/PageWrapper';
import HotelListings from '@/components/hotelComponent/HotelListings';
import HotelSearchForm from '@/components/hotelComponent/HotelSearchForm';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';



const CustomerHomePage = () => (
  <CustomerLayout>
    <PageWrapper>
      {/* Hero section */}
      <div
        className="bg-cover bg-center h-[500px] relative flex items-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80)',
        }}
      >
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl text-white mb-8">
            The best prices for over 10,000 hotels worldwide
          </p>
        </div>
      </div>

      {/* Search form */}
      <div className="container mx-auto px-4">
        <HotelSearchForm />
      </div>

      {/* Popular destinations */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Popular Destinations</h2>
            <Button variant="link" className="text-hotel-blue flex items-center">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           
          </div>
        </div>
      </section>

      {/* Hotel listings */}
      <HotelListings />

      {/* Featured section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4">Join as a Hotel Partner</h2>
                <p className="text-gray-600 mb-6">
                  List your property on Hospitopia Hub and reach millions of travelers worldwide. Manage your bookings, set your prices, and grow your business.
                </p>
                <div>
                  <Button className="bg-shopee hover:bg-shopee-dark">
                    Register as Partner
                  </Button>
                </div>
              </div>
              <div className="h-64 lg:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
                  alt="Hotel Partner"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  </CustomerLayout>
);

export default CustomerHomePage; 