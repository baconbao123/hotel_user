import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelCard from '@/components/hotelComponent/HotelCard';
import apiClient from '@/api/client';
import { HOTEL_ENDPOINTS } from '@/api/endpoints';
import CustomerLayout from '@/layouts/CustomerLayout';

interface Hotel {
  id: string;
  name: string;
  imageUrl: string;
  location: string;
  pricePerNight: string;
  rating: number;
  reviewCount: number;
  discount?: number;
  amenities: { name: string; icon?: string }[];
}

const FavoriteHotels: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const favIds: string[] = JSON.parse(localStorage.getItem('favoriteHotels') || '[]');
    if (favIds.length === 0) {
      setHotels([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    Promise.all(
      favIds.map(id =>
        apiClient.get(HOTEL_ENDPOINTS.GET_BY_ID(id))
          .then(res => res.data)
          .catch(() => null)
      )
    ).then(results => {
      const validHotels = results.filter(Boolean) as Hotel[];
      setHotels(validHotels);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load favorite hotels.');
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <CustomerLayout>

    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Favorite Hotels</h1>
      {hotels.length === 0 ? (
        <div className="text-center text-gray-500">No favorite hotels yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {hotels.map(hotel => (
            <div key={hotel.id} className="relative group cursor-pointer">
              <div onClick={() => navigate(`/hotel/${hotel.id}`)}>
                <HotelCard hotel={hotel} />
              </div>
              <button
                className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-red-100 transition opacity-0 group-hover:opacity-100"
                title="Remove from favorites"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  // Xóa khỏi localStorage
                  let favs = JSON.parse(localStorage.getItem('favoriteHotels') || '[]');
                  favs = favs.filter((fid: string) => fid !== hotel.id);
                  localStorage.setItem('favoriteHotels', JSON.stringify(favs));
                  // Cập nhật lại danh sách
                  setHotels(hotels.filter(h => h.id !== hotel.id));
                  // Phát event để Navbar cập nhật badge
                  window.dispatchEvent(new Event('favorite-hotels-changed'));
                }}
              >
                <span className="text-red-500 font-bold">×</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </CustomerLayout>
  );
};

export default FavoriteHotels; 