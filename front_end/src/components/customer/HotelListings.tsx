import React, { useState } from "react";
import HotelCard from "./HotelCard";
import HotelFilters from "./HotelFilters";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInfiniteHotels } from "@/hooks/useHotelsData";

const HotelListings: React.FC = () => {
  const { hotels, loading, error, hasMore, filters, provinces } = useInfiniteHotels();
  const [filterState, setFilterState] = useState<any>({});

  // Lọc khách sạn theo filterState
  const filteredHotels = hotels.filter(hotel => {
    let match = true;
    if (filterState.province) {
      match = match && hotel.address?.includes(filterState.province);
    }
    if (filterState.amenities?.length) {
      match = match && filterState.amenities.every((id: number) => hotel.facilities?.some((f: any) => f.id === id));
    }
    if (filters?.price && filterState.priceRange) {
      match = match && hotel.priceNight >= filterState.priceRange[0] && hotel.priceNight <= filterState.priceRange[1];
    }
    return match;
  });

  const mockHotels = [
    {
      id: "1",
      name: "Khách sạn Mẫu 1",
      imageUrl: "https://via.placeholder.com/300x200?text=Hotel+1",
      location: "Hà Nội",
      pricePerNight: "$100",
      rating: 4.5,
      reviewCount: 120,
      discount: 0,
      amenities: [
        { name: "WiFi", icon: "fa fa-wifi" },
        { name: "Parking", icon: "fa fa-parking" }
      ]
    },
    {
      id: "2",
      name: "Khách sạn Mẫu 2",
      imageUrl: "https://via.placeholder.com/300x200?text=Hotel+2",
      location: "Hồ Chí Minh",
      pricePerNight: "$120",
      rating: 4.2,
      reviewCount: 80,
      discount: 10,
      amenities: [
        { name: "Pool", icon: "fa fa-swimming-pool" },
        { name: "Spa", icon: "fa fa-spa" }
      ]
    }
  ];

  const baseHotelImg = import.meta.env.VITE_REACT_APP_BACK_END_UPLOAD_HOTEL;
  const userHotel = {
    id: "1",
    name: "Hotel Example",
    imageUrl: `${baseHotelImg}/0d5f495db6a94a0090e6dcfc20102af7.png`,
    location: "1 a Street, Ward An Phú, An Phú District, An Giang City",
    pricePerNight: "$20",
    rating: 0,
    reviewCount: 0,
    discount: 0,
    amenities: [
      { name: "check", icon: "pi pi-check" }
    ]
  };

  if (loading && hotels.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
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
            <HotelFilters
              provinces={provinces}
              facilities={filters?.facilities}
              price={filters?.price}
              onFilterChange={setFilterState}
            />
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.length
                ? filteredHotels.map((hotel) => {
                    const mappedHotel = {
                      id: hotel.id.toString(),
                      name: hotel.address || 'No name',
                      imageUrl: hotel.avatarUrl ? `${baseHotelImg}/${hotel.avatarUrl}` : '',
                      location: hotel.address || '',
                      pricePerNight: hotel.priceNight ? `$${hotel.priceNight}` : 'N/A',
                      rating: 0,
                      reviewCount: 0,
                      discount: 0,
                      amenities: hotel.facilities?.map((f: any) => ({ name: f.name, icon: f.icon })) || [],
                    };
                    return <HotelCard key={mappedHotel.id} hotel={mappedHotel} />;
                  })
                : [userHotel, ...mockHotels].map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))
              }
            </div>
            {loading && <div>Loading more hotels...</div>}
            {!hasMore && <div>Not Found Hotels.</div>}
            {error && <div>{error}</div>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelListings; 