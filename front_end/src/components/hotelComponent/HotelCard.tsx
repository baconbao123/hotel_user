import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { message } from 'antd';

interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    imageUrl: string;
    location: string;
    pricePerNight: string;
    rating: number;
    reviewCount: number;
    discount?: number;
    amenities: { name: string; icon?: string }[];
  };
}

export const HotelCard = ({ hotel }: HotelCardProps) => {
  const {
    id,
    name,
    imageUrl,
    location,
    pricePerNight,
    rating,
    reviewCount,
    discount,
    amenities,
  } = hotel;

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favoriteHotels') || '[]');
    setIsFavorite(favs.includes(id));
  }, [id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    let favs = JSON.parse(localStorage.getItem('favoriteHotels') || '[]');
    if (favs.includes(id)) {
      favs = favs.filter((fid: string) => fid !== id);
      setIsFavorite(false);
    } else {
      favs.push(id);
      setIsFavorite(true);
      message.success({ content: 'Added to favorites!', duration: 2, style: { bottom: 24, right: 24 } });
    }
    localStorage.setItem('favoriteHotels', JSON.stringify(favs));
    window.dispatchEvent(new Event('favorite-hotels-changed'));
  };

  const discountedPrice = discount
    ? parseInt(pricePerNight.replace(/[^0-9]/g, "")) * (1 - discount / 100)
    : null;
 

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        {discount && (
          <Badge className="absolute top-2 left-2 bg-shopee text-white">
            {discount}% OFF
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 rounded-full"
          onClick={toggleFavorite}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>
      <CardContent className="pt-4 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium ml-1">{rating}</span>
            <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{location}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {amenities.slice(0, 3).map((amenity, index) => {
            if (typeof amenity === "string") {
              return (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              );
            } else {
              return (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs flex items-center gap-1"
                >
                  {amenity.icon && <i className={amenity.icon}></i>}
                  {amenity.name}
                </Badge>
              );
            }
          })}
          {amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{amenities.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex items-end justify-between">
        <div>
          {discount ? (
            <div>
              <span className="text-sm text-gray-500 line-through">
                {pricePerNight}
              </span>
              <p className="font-bold text-shopee">
                ${discountedPrice?.toFixed(0)}
                <span className="text-sm font-normal"> / night</span>
              </p>
            </div>
          ) : (
            <p className="font-bold">
              {pricePerNight}
              <span className="text-sm font-normal text-gray-500">
                {" "}
                / night
              </span>
            </p>
          )}
        </div>
        <Button
          asChild
          size="sm"
          className="bg-hotel-blue hover:bg-hotel-blue-dark"
        >
          <Link to={`/hotel/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HotelCard;
