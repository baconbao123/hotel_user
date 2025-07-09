import React, { useState } from 'react';
import { useLocation } from "react-router-dom";

const Booking = () => {
  // State cho form
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    checkIn: '',
    checkOut: '',
    roomType: '',
    roomCount: 1,
    note: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();
  const bookingInfo = location.state || {};
  const { room, selectedDate, selectedSlot } = bookingInfo;

  // Giả lập thông tin phòng đã chọn (có thể lấy từ location state hoặc props)
  const selectedRoom = {
    name: 'Deluxe Room',
    imageUrl: '/placeholder.jpg',
    price: 50,
    amenities: ['Wifi', 'Breakfast', 'Parking'],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate đơn giản
    if (!form.name || !form.phone || !form.email || !form.checkIn || !form.checkOut || !form.roomType) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    setError('');
    setSuccess(true);
    // Gửi API đặt phòng ở đây nếu cần
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Đặt phòng khách sạn</h1>
      {/* Hiển thị lại thông tin đã chọn nếu có */}
      {room && (
        <div className="mb-4 p-4 border rounded-lg">
          <div className="font-semibold text-lg mb-1">{room.hotelName}</div>
          <div className="mb-1">{room.name}</div>
          <div className="mb-1 text-gray-600 text-sm">{room.address}</div>
          <div className="mb-1">Ngày: <span className="font-medium">{selectedDate}</span></div>
          <div>Khung giờ: <span className="font-medium">{selectedSlot}</span></div>
        </div>
      )}
      {/* Thông tin phòng đã chọn */}
      <div className="flex gap-6 mb-8 items-center">
        <img src={selectedRoom.imageUrl} alt={selectedRoom.name} className="w-32 h-24 object-cover rounded-lg" />
        <div>
          <h2 className="text-lg font-semibold">{selectedRoom.name}</h2>
          <p className="text-blue-600 font-bold">${selectedRoom.price}/đêm</p>
          <div className="flex gap-2 mt-1 text-sm text-gray-600">
            {selectedRoom.amenities.map((a, i) => (
              <span key={i} className="bg-gray-100 px-2 py-1 rounded-full">{a}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Form đặt phòng */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Họ tên</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Số điện thoại</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Loại phòng</label>
            <select name="roomType" value={form.roomType} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="">Chọn loại phòng</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="standard">Standard</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Ngày nhận phòng</label>
            <input type="date" name="checkIn" value={form.checkIn} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Ngày trả phòng</label>
            <input type="date" name="checkOut" value={form.checkOut} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Số lượng phòng</label>
          <input type="number" name="roomCount" min={1} value={form.roomCount} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">Ghi chú</label>
          <textarea name="note" value={form.note} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={2} />
        </div>
        {error && <div className="text-red-600 font-medium">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Xác nhận đặt phòng</button>
        {success && <div className="text-green-600 font-medium text-center mt-2">Đặt phòng thành công!</div>}
      </form>
    </div>
  );
};

export default Booking; 