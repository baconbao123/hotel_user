
export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  website?: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  ownerId: string;
  amenities: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  capacity: number;
  count: number;
  size: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HotelRequest {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  website?: string;
  amenities: string[];
  images: string[];
}

export interface RoomRequest {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  capacity: number;
  count: number;
  size: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
}

export interface HotelResponse {
  hotel: Hotel;
}

export interface HotelsResponse {
  hotels: Hotel[];
  total: number;
  page: number;
  limit: number;
}

export interface RoomResponse {
  room: Room;
}

export interface RoomsResponse {
  rooms: Room[];
  total: number;
  page: number;
  limit: number;
}
