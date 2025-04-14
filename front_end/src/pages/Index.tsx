
import React from 'react';
import { CustomerLayout } from '@/layouts/CustomerLayout';
import HotelSearchForm from '@/components/customer/HotelSearchForm';
import HotelCard from '@/components/customer/HotelCard';
import HotelFilters from '@/components/customer/HotelFilters';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight } from 'lucide-react';

// Sample hotel data
const hotels = [
  {
    id: 'hotel1',
    name: 'Grand Luxury Hotel & Spa',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    location: 'New York, USA',
    pricePerNight: '$249',
    rating: 4.8,
    reviewCount: 342,
    discount: 15,
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
  },
  {
    id: 'hotel2',
    name: 'Seaside Resort Paradise',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    location: 'Miami, USA',
    pricePerNight: '$179',
    rating: 4.5,
    reviewCount: 256,
    amenities: ['Beach Access', 'Pool', 'Bar', 'Restaurant'],
  },
  {
    id: 'hotel3',
    name: 'Mountain View Lodge',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    location: 'Denver, USA',
    pricePerNight: '$149',
    rating: 4.6,
    reviewCount: 198,
    discount: 10,
    amenities: ['Mountain View', 'Fireplace', 'Hiking', 'Breakfast'],
  },
  {
    id: 'hotel4',
    name: 'City Center Boutique Hotel',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    location: 'San Francisco, USA',
    pricePerNight: '$219',
    rating: 4.7,
    reviewCount: 287,
    amenities: ['City View', 'Bar', 'Restaurant', 'WiFi'],
  },
  {
    id: 'hotel5',
    name: 'Historic Garden Hotel',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    location: 'Boston, USA',
    pricePerNight: '$189',
    rating: 4.4,
    reviewCount: 176,
    discount: 20,
    amenities: ['Garden', 'Historic Building', 'Breakfast', 'WiFi'],
  },
  {
    id: 'hotel6',
    name: 'Modern Urban Suites',
    imageUrl: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    location: 'Chicago, USA',
    pricePerNight: '$239',
    rating: 4.9,
    reviewCount: 312,
    amenities: ['City View', 'Modern Design', 'Gym', 'Bar'],
  },
];

const popularDestinations = [
  {
    name: 'New York',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    hotelCount: 254,
  },
  {
    name: 'Paris',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80',
    hotelCount: 189,
  },
  {
    name: 'Tokyo',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    hotelCount: 217,
  },
  {
    name: 'Dubai',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    hotelCount: 142,
  },
];

const Index = () => {
  return (
    <CustomerLayout>
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
            {popularDestinations.map((destination) => (
              <div
                key={destination.name}
                className="relative overflow-hidden rounded-lg shadow-md h-60 group cursor-pointer"
              >
                <img
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                  <p className="text-white text-sm">{destination.hotelCount} hotels</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel listings */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Find Your Next Stay</h2>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Hotels</TabsTrigger>
              <TabsTrigger value="deals">Best Deals</TabsTrigger>
              <TabsTrigger value="rated">Top Rated</TabsTrigger>
              <TabsTrigger value="luxury">Luxury</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-20">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              <HotelFilters />
            </div>

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Button className="bg-hotel-blue hover:bg-hotel-blue-dark">
                  Load More Hotels
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
    </CustomerLayout>
  );
};

export default Index;
