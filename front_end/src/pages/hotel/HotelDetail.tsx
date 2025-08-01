import React, { useEffect, useRef, useState } from "react";
import {
  StarIcon,
  MapPinIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { CheckIcon, UsersIcon } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "primeicons/primeicons.css"; // Import PrimeIcons CSS
import CustomerLayout from "@/layouts/CustomerLayout";
import RoomBookingModal from '@/components/customer/RoomBookingModal';
import { Modal, message } from 'antd';
import { isAuthenticated } from "@/lib/utils";
import AuthRequiredModal from '@/components/common/AuthRequiredModal';
import { useDispatch } from 'react-redux';
import { setHotelDetail, setRoomDetail } from '@/store/slice/commonDataSlice';
import { Rate } from 'antd';

type RoomRate = {
  name: string;
  priceOvernight: string;
  breakfast: boolean;
  refundable: boolean;
  discount?: string;
};

type Facility = {
  name: string;
  icon: string;
};

type RoomOption = {
  mainName: string;
  description: string;
  size: string;
  guest: string;
  images: string[];
  features: string[];
  facilities: Facility[];
  bathrooms: string[];
  rates: RoomRate[];
  type: string;
  roomId: string;
};

type Room = {
  id: number;
  name: string;
  description?: string;
  area: number;
  limit: number;
  avatarRoom?: string;
  priceNight: number;
  priceHours: number;
  facilities: { name: string; icon: string }[];
};

type HotelData = {
  hotel: {
    name: string;
    address: string;
    description: string;
    avatar: string;
    facilities: { name: string; icon: string }[];
    images: { name: string }[];
    policy: { name: string; description: string };
  };
  types: { name: string; rooms: Room[] }[];
};

type ApiResponse = {
  code: number;
  result: HotelData;
};

export default function HotelDetail() {
  const overviewRef = useRef<HTMLDivElement>(null);
  const roomsRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const policyRef = useRef<HTMLDivElement>(null);

  const [showDetail, setShowDetail] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(null);
  const [selectedRateIndex, setSelectedRateIndex] = useState<number | null>(
    null
  );
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number | null>(
    null
  );
  const [hotelData, setHotelData] = useState<HotelData | null>(null);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const reviews = [
    {
      name: "Minh Nguyen",
      rating: 5,
      comment: "Clean hotel, friendly staff, great location.",
    },
    {
      name: "Ha Anh",
      rating: 4,
      comment: "Spacious room, good service, a bit noisy at night.",
    },
    {
      name: "Van Tran",
      rating: 5,
      comment: "Very satisfied, will come back next time!",
    },
  ];

  const { hotelId } = useParams<{ hotelId: string }>();

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingType, setBookingType] = useState("hour");
  const [bookingHour, setBookingHour] = useState(1);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const dispatch = useDispatch();

  const [localReviews, setLocalReviews] = useState<any[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem('hotel_reviews');
    if (stored) setLocalReviews(JSON.parse(stored));
  }, []);
  const hotelReviews = localReviews.filter(r => String(r.hotelId) === String(hotelId));

  useEffect(() => {
    const url = `http://localhost:9898/hotel/user/hotel/${hotelId}`;
    const fetchData = async () => {
      try {
        const res = await axios.get<ApiResponse>(url);
        if (res.data.code === 200) {
          setHotelData(res.data.result);
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };
    fetchData();
  }, [hotelId]);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleShowDetail = (room: RoomOption, rateIndex: number) => {
    setSelectedRoom(room);
    setSelectedRateIndex(rateIndex);
    setShowDetail(true);
    // Lưu thông tin khách sạn và phòng vào Redux
    if (hotelData) {
      dispatch(setHotelDetail(hotelData.hotel));
    }
    dispatch(setRoomDetail({
      id: room.roomId,
      name: room.mainName,
      description: room.description,
      area: Number(room.size),
      limit: Number(room.guest),
      avatarRoom: room.images?.[0] || '',
      priceNight: Number(room.rates?.[0]?.priceOvernight?.replace(/[^\d.]/g, '')),
      priceHours: Number(room.rates?.[1]?.priceOvernight?.replace(/[^\d.]/g, '')),
      facilities: room.facilities
    }));
  };

  const roomRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([]);

  const handleTypeRoomClick = (index: number) => {
    roomRefs.current[index]?.current?.scrollIntoView({ behavior: "smooth" });
    setSelectedRoomIndex(index);
  };

  // Handle Reserve Now button click
  const handleReserveNow = () => {
    if (!isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }
    setShowBookingForm(true);
  };

  const roomOptions: RoomOption[] =
    hotelData?.types.flatMap((type) =>
      type.rooms.map((room) => ({
        mainName: room.name,
        description:
          room.description ||
          "Comfortable and modern room suitable for all guests.",
        size: `${room.area} m²`,
        guest: `${room.limit} guests`,
        images: [
          room.avatarRoom
            ? `http://localhost:9898/hotel/upload/hotel/${room.avatarRoom}`
            : "/placeholder.jpg",
        ],
        features: ["Comfortable bed", "High-speed Wi-Fi"],
        facilities: room.facilities.map((f) => ({
          name: f.name,
          icon: f.icon,
        })),
        bathrooms: ["Shower", "Premium toiletries"],
        rates: [
          {
            name: "Overnight Stay",
            priceOvernight: `$${room.priceNight.toFixed(2)}`,
            breakfast: room.priceNight > 50,
            refundable: true,
            discount:
              room.priceNight > 50
                ? `$${(room.priceNight + 10).toFixed(2)}`
                : undefined,
          },
          {
            name: "Hourly Stay",
            priceOvernight: `$${room.priceHours.toFixed(2)}`,
            breakfast: false,
            refundable: false,
          },
        ],
        type: type.name,
        roomId: room.id.toString(),
      }))
    ) || [];

  if (roomRefs.current.length !== hotelData?.types.length) {
    roomRefs.current = Array(hotelData?.types.length || 0)
      .fill(null)
      .map(() => React.createRef<HTMLDivElement>());
  }

  if (!hotelData)
    return <p className="text-center mt-10">Loading hotel data...</p>;

  // Giả lập thông tin phòng, bạn có thể lấy từ dữ liệu thực tế
  const room = hotelData
    ? {
        name: hotelData.types?.[0]?.rooms?.[0]?.name || "Standard Room",
        imageUrl: hotelData.types?.[0]?.rooms?.[0]?.avatarRoom
          ? `http://localhost:9898/hotel/upload/hotel/${hotelData.types[0].rooms[0].avatarRoom}`
          : "/placeholder.jpg",
        price: hotelData.types?.[0]?.rooms?.[0]?.priceNight || 170000,
        hotelName: hotelData.hotel.name,
        address: hotelData.hotel.address,
      }
    : null;

  // Tính tổng điểm trung bình và số lượng review
  const totalReviews = hotelReviews.length;
  const averageRating = totalReviews > 0 ? (hotelReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1) : null;

  // Thêm hàm maskName ở đầu component
  const maskName = (name: string) => {
    if (!name) return "";
    if (name.length <= 2) return name[0] + "*";
    return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
  };

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Carousel
              showThumbs={true}
              autoPlay={true}
              infiniteLoop={true}
              showStatus={false}
              dynamicHeight={false}
              thumbWidth={80}
            >
              {hotelData.hotel.images?.length > 0
                ? hotelData.hotel.images.map((img, idx) => (
                    <div key={idx}>
                      <img
                        src={`http://localhost:9898/hotel/upload/hotel/${img.name}`}
                        alt={`Hotel ${idx}`}
                        className="h-[300px] object-cover rounded-xl"
                      />
                    </div>
                  ))
                : [
                    <div key="placeholder">
                      <img src="/placeholder.jpg" alt="Placeholder" />
                    </div>,
                  ]}
            </Carousel>
            <style>
              {`
              .carousel .thumbs-wrapper { margin-top: 10px; }
              .carousel .thumb { margin-right: 6px; border: 2px solid transparent; border-radius: 8px; overflow: hidden; width: 80px !important; height: 60px !important; transition: border 0.3s ease; }
              .carousel .thumb img { object-fit: cover; width: 100%; height: 100%; }
              .carousel .thumb.selected, .carousel .thumb:hover { border: 2px solid #3b82f6; }
            `}
            </style>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {hotelData.hotel.name}
              </h1>
              <div className="flex items-center text-gray-500 mb-1">
                <MapPinIcon className="w-5 h-5 mr-1" />
                <span>{hotelData.hotel.address}</span>
              </div>
              <div className="flex items-center text-yellow-500 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5" />
                ))}
                <span className="ml-2 text-gray-700">
                  (8.4/10 · 4,297 reviews)
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                {hotelData.hotel.description}
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {hotelData.hotel.facilities?.map((facility, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <i className={`${facility.icon} text-green-500`}></i>
                    <span>{facility.name}</span>
                  </div>
                )) || <span>No amenities available</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex gap-6 overflow-x-auto">
            {[
              { label: "Overview", ref: overviewRef },
              { label: "Rooms", ref: roomsRef },
              { label: "Location", ref: locationRef },
              { label: "Reviews", ref: reviewsRef },
              { label: "Policy", ref: policyRef },
            ].map((tab, i) => (
              <button
                key={i}
                onClick={() => handleScroll(tab.ref)}
                className="py-3 px-4 font-medium text-gray-600 hover:text-blue-600 transition"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

      <div ref={roomsRef} className="mt-8">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Room Accommodations</h2>
        {hotelData.types.map((type, typeIdx) => (
          <div key={typeIdx} ref={roomRefs.current[typeIdx]} className="mb-12">
            <h3 className="text-xl font-semibold mb-4">{type.name}</h3>
            <div className="grid gap-8">
              {roomOptions
                .filter((room) => room.type === type.name)
                .map((option, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white flex flex-col lg:flex-row"
                  >
                    <div className="w-full lg:w-1/3 mb-6 lg:mb-0 relative">
                      <Carousel
                        showThumbs={false}
                        infiniteLoop
                        autoPlay
                        interval={3000}
                        showStatus={false}
                        className="rounded-xl overflow-hidden"
                      >
                        {option.images.map((image, imgIdx) => (
                          <div key={imgIdx} className="relative">
                            <img
                              src={image}
                              alt={`${option.mainName} - Image ${imgIdx + 1}`}
                              className="w-full h-56 object-cover rounded-xl"
                            />
                          </div>
                        ))}
                      </Carousel>
                      <div className="mt-3 text-sm text-gray-600 flex flex-col space-y-1">
                        {option.facilities.map((facility, facilityIdx) => (
                          <span key={facilityIdx} className="flex items-center">
                            <i className={`${facility.icon} mr-2 text-blue-600`}></i>
                            {facility.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 lg:pl-8 flex flex-col">
                      <h3 className="font-semibold text-xl mb-4 text-gray-800">{option.mainName}</h3>
                      <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 border-b pb-2 mb-2">
                        <div>Room Selection</div>
                        <div>Guest Limit</div>
                        <div>Price</div>
                        <div>Choose</div>
                      </div>
                      {option.rates.map((rate, rateIdx) => (
                        <div
                          key={rateIdx}
                          className="grid grid-cols-4 gap-4 text-sm items-center border-b py-3 last:border-0"
                        >
                          <div className="text-gray-700">{rate.name}</div>
                          <div className="flex items-center text-gray-700">
                            <UsersIcon className="w-5 h-5 mr-1 text-blue-500" />
                            {option.guest}
                          </div>
                          <div>
                            <p className="font-semibold text-blue-600">{rate.priceOvernight}</p>
                          </div>
                          <div>
                            <button
                              className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs w-full hover:bg-blue-700 transition flex items-center justify-center"
                              onClick={() => {
                                if (!isAuthenticated()) {
                                  setShowAuthModal(true);
                                  return;
                                }
                                handleShowDetail(option, rateIdx);
                              }}
                            >
                              <CheckIcon className="w-4 h-4 mr-1" /> Choose
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )) || <p>No rooms available</p>}
      </div>

        <div className="relative inline-block mt-10 mb-4">
          <select
            value={selectedRoomIndex ?? ""}
            onChange={(e) => handleTypeRoomClick(Number(e.target.value))}
            className="border border-gray-300 px-2 py-1 rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Room Type</option>
            {hotelData.types.map((type, idx) => (
              <option key={idx} value={idx}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div ref={locationRef} className="mt-10">
          <h2 className="text-xl font-bold mb-4">Location</h2>
          <p className="text-gray-700 mb-4">{hotelData.hotel.address}</p>
          <div className="w-full h-96 rounded-xl overflow-hidden shadow">
            {/* <LoadScript googleMapsApiKey="">
            <GoogleMap
              mapContainerStyle={{ height: "100%", width: "100%" }}
              zoom={15}
              center={{ lat: 10.3769, lng: 105.4374 }} // Fallback for An Giang
            >
              <Marker position={{ lat: 10.3769, lng: 105.4374 }} />
            </GoogleMap>
          </LoadScript> */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d38950.194808931476!2d106.68436445752558!3d10.771700096450228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sAptech!5e1!3m2!1svi!2s!4v1752041341624!5m2!1svi!2s"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
            ></iframe>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span>Reviews</span>
            {totalReviews > 0 && (
              <span className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-lg font-semibold ml-4 shadow">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6 mr-1 text-orange-500"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                {averageRating} <span className="ml-1 text-base font-normal">/ 5</span>
              </span>
            )}
            <span className="ml-4 text-gray-500 text-base">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</span>
          </h2>
          {hotelReviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {hotelReviews.map((review, idx) => (
                <div key={idx} className="flex gap-4 items-start mb-6 border rounded-xl p-4 bg-white shadow hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center text-2xl font-bold text-orange-700">
                    {review.userName ? review.userName[0].toUpperCase() : "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-4 items-center mb-1">
                      <span className="text-gray-500">{review.createdAt && new Date(review.createdAt).toLocaleDateString("en-US")}</span>
                      <span className="font-semibold">Customer: {maskName(review.userName)}</span>
                      <span className="font-semibold">Room: {review.roomName}</span>
                      <span className="flex items-center gap-1">
                        Rating: <Rate disabled value={review.rating} />
                      </span>
                    </div>
                    <div className="text-gray-800">{review.comment}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No reviews yet.</div>
          )}
        </div>

        

        <div ref={policyRef} className="mt-10">
          <h2 className="text-xl font-bold mb-4">Hotel Policies</h2>
          <p className="text-gray-700">{hotelData.hotel.policy?.description}</p>
        </div>

      {showDetail && selectedRoom && selectedRateIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-6xl w-full p-6 relative my-10">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowDetail(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedRoom.mainName}</h2>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <Carousel
                  showThumbs={true}
                  autoPlay={true}
                  infiniteLoop={true}
                  showStatus={false}
                  dynamicHeight={false}
                  thumbWidth={80}
                >
                  {selectedRoom.images.map((img, idx) => (
                    <div key={idx}>
                      <img
                        src={img}
                        alt={`Room ${idx}`}
                        className="h-[300px] object-cover rounded-xl"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
              <div className="flex-1 text-sm">
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Room Details</h3>
                  <div className="flex items-center gap-4 mb-1">
                    <span>📐 {selectedRoom.size}</span>
                    <span>👥 {selectedRoom.guest}</span>
                  </div>
                </div>
                <hr className="my-2" />
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Features</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedRoom.features.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <hr className="my-2" />
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Amenities</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedRoom.facilities.map((facility, idx) => (
                      <li key={idx} className="flex items-center">
                        <i className={`${facility.icon} mr-2 text-blue-600`}></i>
                        {facility.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <hr className="my-2" />
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Bathroom</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedRoom.bathrooms.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 text-right">
                  <p className="text-gray-700 text-sm mb-1">Starting from</p>
                  {selectedRoom.rates[selectedRateIndex].discount && (
                    <p className="text-xs text-gray-500 line-through">
                      {selectedRoom.rates[selectedRateIndex].discount}
                    </p>
                  )}
                  <p className="text-red-600 font-bold text-lg">
                    {selectedRoom.rates[selectedRateIndex].priceOvernight} / night
                  </p>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition mt-2"
                    onClick={handleReserveNow}
                  >
                    Reserve Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBookingForm && selectedRoom && (
        <RoomBookingModal
          roomId={selectedRoom.roomId}
          show={showBookingForm}
          onClose={() => setShowBookingForm(false)}
        />
      )}

      <AuthRequiredModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        returnUrl={window.location.pathname + window.location.search}
      />
    </div>
    </CustomerLayout>
  );
}
