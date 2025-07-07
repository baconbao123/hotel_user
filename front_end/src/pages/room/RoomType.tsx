export interface Image {
  id: number;
  name: string;
  hotelId: number;
  createdAt: string;
  updatedAt: string | null;
  createdBy: number;
  updatedBy: number | null;
  deletedAt: string | null;
}

export interface Facility {
  id: number;
  name: string;
  icon: string;
}

export interface HotelPolicy {
  id: number;
  name: string;
  description: string;
}

export interface Hotel {
  id: number;
  name: string;
  address: string;
  description: string;
  avatar: string;
  facilities: Facility[];
  images: Image[];
  policy: HotelPolicy;
}

export interface Room {
  id: number;
  name: string;
  avatarRoom: string;
  description: string;
  facilities: Facility[];
  area: number;
  roomNumber: number;
  priceNight: number;
  priceHours: number;
  type: string;
  limit: number;
}

export interface RoomType {
  name: string;
  rooms: Room[];
}

export type RoomRate = {
  name: string;
  priceOvernight: string;
  breakfast: boolean;
  refundable: boolean;
  discount?: string;
};

export type RoomOption = {
  mainName: string;
  description: string;
  size: string;
  guest: string;
  images: string[];
  features: string[];
  facilities: string[];
  bathrooms: string[];
  rates: RoomRate[];
};
