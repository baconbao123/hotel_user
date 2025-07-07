import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

interface Facility {
  id: number;
  name: string;
  icon: string;
}
interface Province {
  code: string;
  name: string;
}
interface Price {
  min: number;
  max: number;
}

interface HotelFiltersProps {
  provinces?: Province[];
  facilities?: Facility[];
  price?: Price;
  onFilterChange?: (filters: any) => void;
}

export const HotelFilters = ({ provinces, facilities, price, onFilterChange }: HotelFiltersProps) => {
  // Giả lập dữ liệu nếu không có
  const fallbackProvinces = [
    { code: '01', name: 'Hà Nội' },
    { code: '02', name: 'Hồ Chí Minh' },
    { code: '03', name: 'Đà Nẵng' },
  ];
  const fallbackFacilities = [
    { id: 1, name: 'WiFi', icon: 'fa fa-wifi' },
    { id: 2, name: 'Pool', icon: 'fa fa-swimming-pool' },
    { id: 3, name: 'Parking', icon: 'fa fa-parking' },
  ];
  const fallbackPrice = { min: 0, max: 1000 };

  const [selectedProvince, setSelectedProvince] = useState('');
  const [priceRange, setPriceRange] = useState([
    price?.min ?? fallbackPrice.min,
    price?.max ?? fallbackPrice.max,
  ]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleStarClick = (star: number) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  const handleAmenityChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedAmenities((prev) => [...prev, id]);
    } else {
      setSelectedAmenities((prev) => prev.filter((a) => a !== id));
    }
  };

  const handleClearFilters = () => {
    setSelectedProvince('');
    setPriceRange([price?.min ?? fallbackPrice.min, price?.max ?? fallbackPrice.max]);
    setSelectedStars([]);
    setSelectedAmenities([]);
  };

  // Gửi filter ra ngoài nếu cần
  React.useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        province: selectedProvince,
        priceRange,
        stars: selectedStars,
        amenities: selectedAmenities,
      });
    }
  }, [selectedProvince, priceRange, selectedStars, selectedAmenities]);

  return (
    <>
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full"
        >
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block space-y-6`}>
        {/* Tỉnh thành */}
        <div>
          <h3 className="font-medium mb-4">Tỉnh thành</h3>
          <select
            className="w-full border rounded px-2 py-1"
            value={selectedProvince}
            onChange={e => setSelectedProvince(e.target.value)}
          >
            <option value="">Tất cả</option>
            {(provinces?.length ? provinces : fallbackProvinces).map((p) => (
              <option key={p.code} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
        {/* Price Range */}
        <div>
          <h3 className="font-medium mb-4">Price Range</h3>
          <Slider
            value={priceRange}
            min={price?.min ?? fallbackPrice.min}
            max={price?.max ?? fallbackPrice.max}
            step={10}
            onValueChange={setPriceRange}
            className="mb-2"
          />
          <div className="flex justify-between text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
        {/* Star Rating */}
        <div>
          <h3 className="font-medium mb-4">Star Rating</h3>
          <div className="flex flex-wrap gap-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <Badge
                key={star}
                variant={selectedStars.includes(star) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleStarClick(star)}
              >
                {star} <Star className="h-3 w-3 ml-1 inline" />
              </Badge>
            ))}
          </div>
        </div>
        {/* Amenities */}
        <div>
          <h3 className="font-medium mb-4">Amenities</h3>
          <div className="space-y-2">
            {(facilities?.length ? facilities : fallbackFacilities).map((f) => (
              <div key={f.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${f.id}`}
                  checked={selectedAmenities.includes(f.id)}
                  onCheckedChange={(checked) => handleAmenityChange(f.id, checked === true)}
                />
                <Label htmlFor={`amenity-${f.id}`} className="text-sm cursor-pointer flex items-center gap-1">
                  <i className={f.icon}></i> {f.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </>
  );
};

export default HotelFilters;
