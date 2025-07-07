import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '@/axios';

const baseHotelImg = import.meta.env.VITE_REACT_APP_BACK_END_UPLOAD_HOTEL;

const HotelDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`/user/hotel/${id}`)
      .then(res => setData(res.data.result))
      .catch(() => setError('Không thể tải dữ liệu khách sạn'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>Không có dữ liệu</div>;

  const { hotel, types } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img
            src={`${baseHotelImg}/${hotel.avatar}`}
            alt={hotel.name}
            className="w-full h-80 object-cover rounded-lg mb-4"
          />
          <div className="grid grid-cols-3 gap-2">
            {hotel.images?.map((img: any) => (
              <img
                key={img.id}
                src={`${baseHotelImg}/${img.name}`}
                alt={hotel.name}
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
          <p className="text-gray-600 mb-2">{hotel.address}</p>
          <p className="mb-4">{hotel.description}</p>
          <div className="mb-4">
            <span className="font-semibold">Tiện ích:</span>
            <ul className="flex flex-wrap gap-2 mt-2">
              {hotel.facilities?.map((f: any) => (
                <li key={f.id} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                  <i className={f.icon}></i> {f.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <span className="font-semibold">Chính sách:</span>
            <div className="mt-1 bg-gray-50 p-2 rounded">
              <div className="font-bold">{hotel.policy?.name}</div>
              <div className="text-sm text-gray-600">{hotel.policy?.description}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Các loại phòng</h2>
        {types?.map((type: any) => (
          <div key={type.name} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {type.rooms.map((room: any) => (
                <div key={room.id} className="border rounded-lg p-4 flex gap-4">
                  <img
                    src={`${baseHotelImg}/${room.avatarRoom}`}
                    alt={room.name}
                    className="w-32 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="font-bold">{room.name}</div>
                    <div className="text-sm text-gray-600 mb-1">Diện tích: {room.area} m²</div>
                    <div className="text-sm text-gray-600 mb-1">Số phòng: {room.roomNumber}</div>
                    <div className="text-sm text-gray-600 mb-1">Giới hạn: {room.limit} người</div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {room.facilities?.map((f: any) => (
                        <span key={f.id} className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center gap-1">
                          <i className={f.icon}></i> {f.name}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-800 font-semibold">Giá: ${room.priceNight} / đêm, ${room.priceHours} / giờ</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelDetail; 