import React, { useState } from "react";
import HotelCard from "./HotelCard";
import HotelFilters from "./HotelFilters";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInfiniteHotels } from "@/hooks/useHotelsData";

const HotelListings: React.FC = () => {
  // Lấy dữ liệu từ hook, đảm bảo đúng cấu trúc API trả về
  const { hotels: hotelsRaw, loading, error, hasMore, filters, provinces } = useInfiniteHotels();
  // hotelsRaw có thể là object hoặc array, nếu là object thì lấy content
  const hotels = Array.isArray(hotelsRaw) ? hotelsRaw : ((hotelsRaw as any)?.content || []);

  const [filterState, setFilterState] = useState<any>({});

  // Lọc khách sạn theo filterState
  const filteredHotels = hotels.filter((hotel: any) => {
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

  // Thêm log để kiểm tra dữ liệu
  console.log('hotelsRaw:', hotelsRaw);
  console.log('hotels:', hotels);
  console.log('provinces:', provinces);
  console.log('filters:', filters);
  console.log('filteredHotels:', filteredHotels);
  console.log('filterState:', filterState);

  const baseHotelImg = import.meta.env.VITE_REACT_APP_BACK_END_UPLOAD_HOTEL;

 

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
              facilities={filters?.facilities || []}
              price={filters?.price}
              onFilterChange={setFilterState}
            />
          </div>
          <div className="lg:col-span-3">
            {filteredHotels.length >= 10 ? (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto"
                style={{ maxHeight: 600 }}
              >
                {filteredHotels.map((hotel: any) => {
                  const mappedHotel = {
                    id: hotel.id.toString(),
                    name: hotel.name|| 'No name',
                    imageUrl: hotel.avatarUrl ? `${baseHotelImg}/${hotel.avatarUrl}` : '',
                    location: hotel.address || '',
                    pricePerNight: hotel.priceNight ? `$${hotel.priceNight}` : 'N/A',
                    rating: 0,
                    reviewCount: 0,
                    // discount: 0,
                    amenities: hotel.facilities?.map((f: any) => ({ name: f.name, icon: f.icon })) || [],
                  };
                  return <HotelCard key={mappedHotel.id} hotel={mappedHotel} />;
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHotels.map((hotel: any) => {
                  const mappedHotel = {
                    id: hotel.id.toString(),
                    name: hotel.name|| 'No name',
                    imageUrl: hotel.avatarUrl ? `${baseHotelImg}/${hotel.avatarUrl}` : '',
                    location: hotel.address || '',
                    pricePerNight: hotel.priceNight ? `$${hotel.priceNight}` : 'N/A',
                    rating: 0,
                    reviewCount: 0,
                    // discount: 0,
                    amenities: hotel.facilities?.map((f: any) => ({ name: f.name, icon: f.icon })) || [],
                  };
                  return <HotelCard key={mappedHotel.id} hotel={mappedHotel} />;
                })}
              </div>
            )}
            {!loading && filteredHotels.length === 0 && <div>Not Found Hotels.</div>}
            {loading && <div>Loading more hotels...</div>}
            {error && <div>{error}</div>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelListings; 