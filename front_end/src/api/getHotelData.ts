import axios from 'axios';

export interface Province {
  code: string;
  name: string;
}

export interface Facility {
  id: number;
  name: string;
  icon: string;
}

export interface Hotel {
  id: number;
  avatarUrl: string;
  address: string;
  facilities: Facility[];
  priceNight: number;
}

export interface HotelsContent {
  content: Hotel[];
  size: number;
  totalElement: number;
}

export interface Filters {
  facilities: Facility[];
  price: {
    min: number;
    max: number;
  };
}

export interface HotelApiResponse {
  code: number;
  message: string;
  result: {
    provinces: Province[];
    hotels: HotelsContent;
    filters: Filters;
  };
  errorMessages: Record<string, string>;
}

export async function getHotelData(apiUrl: string): Promise<HotelApiResponse> {
  const response = await axios.get<HotelApiResponse>(apiUrl);
  return response.data;
} 