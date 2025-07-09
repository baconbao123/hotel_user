import React from "react";
import CustomerLayout from "@/layouts/CustomerLayout";

const mockHotel = {
  id: "1",
  name: "Khách sạn Mẫu 1",
  images: [
    "https://via.placeholder.com/600x400?text=Hotel+1",
    "https://via.placeholder.com/600x400?text=Hotel+1+View+2",
    "https://via.placeholder.com/600x400?text=Hotel+1+View+3"
  ],
  location: "123 Đường Mẫu, Hà Nội",
  pricePerNight: "$100",
  rating: 4.5,
  reviewCount: 120,
  discount: 10,
  facilities: [
    { name: "WiFi", icon: "fa fa-wifi" },
    { name: "Parking", icon: "fa fa-parking" },
    { name: "Pool", icon: "fa fa-swimming-pool" },
    { name: "Spa", icon: "fa fa-spa" },
    { name: "Gym", icon: "fa fa-dumbbell" }
  ],
  description: "Khách sạn Mẫu 1 nằm ở trung tâm Hà Nội, thuận tiện di chuyển, đầy đủ tiện nghi, dịch vụ chuyên nghiệp, phòng ốc sạch sẽ, hiện đại.",
  rooms: [
    { name: "Phòng Đơn", price: "$80/đêm", desc: "1 giường đơn, 2 khách, view thành phố" },
    { name: "Phòng Đôi", price: "$120/đêm", desc: "1 giường đôi, 4 khách, ban công" }
  ],
  policies: {
    checkin: "14:00",
    checkout: "12:00",
    cancel: "Miễn phí hủy trước 24h nhận phòng. Sau đó tính phí 50% giá phòng."
  }
};

const HotelDetail: React.FC = () => {
  return (
    <CustomerLayout>
      <section className="py-10 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Gallery + Info */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Gallery */}
            <div className="md:w-2/3 w-full">
              <img
                src={mockHotel.images[0]}
                alt={mockHotel.name}
                className="w-full h-72 object-cover rounded-xl shadow mb-3"
              />
              <div className="flex gap-2">
                {mockHotel.images.slice(1).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={mockHotel.name + " view " + (idx + 2)}
                    className="w-24 h-16 object-cover rounded-lg border hover:scale-105 transition"
                  />
                ))}
              </div>
            </div>
            {/* Info */}
            <div className="md:w-1/3 w-full flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{mockHotel.name}</h1>
                <div className="text-gray-600 mb-2 flex items-center gap-2">
                  <i className="fa fa-map-marker-alt text-hotel-blue" />
                  {mockHotel.location}
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 text-xl mr-1">★</span>
                  <span className="font-semibold">{mockHotel.rating}</span>
                  <span className="ml-2 text-gray-500">({mockHotel.reviewCount} đánh giá)</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mockHotel.facilities.map((a, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {a.icon && <i className={`${a.icon} mr-1`} />} {a.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                {mockHotel.discount ? (
                  <>
                    <span className="text-gray-400 line-through mr-2">{mockHotel.pricePerNight}</span>
                    <span className="text-2xl font-bold text-hotel-blue">
                      ${(
                        parseInt(mockHotel.pricePerNight.replace(/[^0-9]/g, "")) * (1 - mockHotel.discount / 100)
                      ).toFixed(0)}
                    </span>
                    <span className="ml-2 text-xs text-red-500 font-semibold">-{mockHotel.discount}%</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-hotel-blue">{mockHotel.pricePerNight}</span>
                )}
                <div className="mt-3">
                  <button className="w-full bg-hotel-blue text-white py-2 rounded-lg font-semibold hover:bg-hotel-blue-dark transition">Đặt phòng ngay</button>
                </div>
              </div>
            </div>
          </div>
          {/* Description & Room List & Policies */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-2">Mô tả khách sạn</h2>
            <p className="text-gray-700 mb-4">{mockHotel.description}</p>
            <h2 className="text-xl font-bold mb-2 mt-6">Danh sách phòng</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {mockHotel.rooms.map((room, idx) => (
                <div key={idx} className="border rounded-lg p-4 flex flex-col gap-2 bg-gray-50">
                  <div className="font-semibold text-lg">{room.name}</div>
                  <div className="text-gray-500 text-sm">{room.desc}</div>
                  <div className="font-bold text-hotel-blue">{room.price}</div>
                  <button className="mt-2 bg-hotel-blue text-white py-1 rounded hover:bg-hotel-blue-dark transition">Đặt phòng</button>
                </div>
              ))}
            </div>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold mb-1">Nhận phòng</h3>
                <div className="text-gray-600">Từ {mockHotel.policies.checkin}</div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Trả phòng</h3>
                <div className="text-gray-600">Trước {mockHotel.policies.checkout}</div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Chính sách hủy phòng</h3>
                <div className="text-gray-600">{mockHotel.policies.cancel}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
};

export default HotelDetail; 