
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

export const HotelFilters = () => {
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const amenities = [
    'WiFi',
    'Pool',
    'Breakfast',
    'Gym',
    'Restaurant',
    'Parking',
    'Air Conditioning',
    'Spa',
    'Bar',
  ];

  const handleStarClick = (star: number) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities((prev) => [...prev, amenity]);
    } else {
      setSelectedAmenities((prev) => prev.filter((a) => a !== amenity));
    }
  };

  const handleClearFilters = () => {
    setPriceRange([50, 500]);
    setSelectedStars([]);
    setSelectedAmenities([]);
  };

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
        <div>
          <h3 className="font-medium mb-4">Price Range</h3>
          <Slider
            value={priceRange}
            min={0}
            max={1000}
            step={10}
            onValueChange={setPriceRange}
            className="mb-2"
          />
          <div className="flex justify-between text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

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

        <div>
          <h3 className="font-medium mb-4">Amenities</h3>
          <div className="space-y-2">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={(checked) =>
                    handleAmenityChange(amenity, checked === true)
                  }
                />
                <Label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">
                  {amenity}
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
