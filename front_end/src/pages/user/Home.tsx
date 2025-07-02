import React, { useEffect, useState } from 'react';
import { getHotelData, HotelApiResponse } from '@/api/getHotelData';
import { API_CONFIG } from '@/config/environment';

const UserHome: React.FC = () => {
  const [data, setData] = useState<HotelApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHotelData(`${API_CONFIG.BASE_URL}/user/home`);
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Tất cả khách sạn</h1>
      <h2>Danh sách khách sạn trong hệ thống</h2>
      <ul>
        {data?.result.hotels.content.map((hotel) => (
          <li key={hotel.id}>
            <img src={hotel.avatarUrl} alt={hotel.address} width={80} />  
            <div>{hotel.address}</div> 
            <div>Giá/đêm: {hotel.priceNight}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserHome; 