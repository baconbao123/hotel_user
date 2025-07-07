import React, { useRef, useState } from "react";
import {
  StarIcon,
  MapPinIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { CheckIcon, UsersIcon } from "lucide-react";

type RoomRate = {
  name: string;
  priceOvernight: string;
  breakfast: boolean;
  refundable: boolean;
  discount?: string;
};

type RoomOption = {
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

export default function HotelDetail() {
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const roomsRef = useRef<HTMLDivElement | null>(null);
  const locationRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const policyRef = useRef<HTMLDivElement | null>(null);

  const [showDetail, setShowDetail] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(null);
  const [selectedRateIndex, setSelectedRateIndex] = useState<number | null>(
    null
  );
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number | null>(
    null
  );

  const images = [
    "/images/hotel-main.jpg",
    "/images/hotel-1.jpg",
    "/images/hotel-2.jpg",
    "/images/hotel-3.jpg",
    "/images/hotel-4.jpg",
    "/images/hotel-5.jpg",
  ];

  const roomOptions: RoomOption[] = [
    {
      mainName: "Deluxe Room - Room Only, Semi-Flexible Rate",
      description: "Spacious deluxe room with modern amenities.",
      size: "41.0 m²",
      guest: "2 guests",
      images: [
        "https://example.com/deluxe1.jpg",
        "https://example.com/deluxe2.jpg",
        "https://example.com/deluxe3.jpg",
        "https://example.com/deluxe4.jpg",
      ],
      features: ["No smoking", "Standing shower", "Hot/cold water", "Balcony", "Air conditioning", "TV"],
      facilities: ["Television", "Minibar", "Desk"],
      bathrooms: ["Private bathroom", "Shower", "Toiletries"],
      rates: [
        {
          name: "Semi-Flexible Rate",
          priceOvernight: "1,701,258 VND",
          breakfast: false,
          refundable: true,
          discount: "2,101,258 VND",
        },
        {
          name: "Breakfast - Semi-Flexible Rate",
          priceOvernight: "1,986,257 VND",
          breakfast: true,
          refundable: true,
          discount: "2,486,257 VND",
        },
        {
          name: "Breakfast - Flexible Rate",
          priceOvernight: "2,477,274 VND",
          breakfast: true,
          refundable: true,
          discount: "2,977,274 VND",
        },
      ],
    },
    {
      mainName: "Deluxe Double",
      description: "Spacious deluxe room, modern style, suitable for couples.",
      size: "23.0 m²",
      guest: "2 guests",
      images: ["/images/room-1.jpg", "/images/room-2.jpg", "/images/room-3.jpg"],
      features: ["Shower", "Hot water", "Air conditioning"],
      facilities: [
        "Air conditioning",
        "Blackout curtains",
        "Television",
        "Minibar",
        "Complimentary bottled water",
        "Desk",
      ],
      bathrooms: ["Hot water", "Private bathroom", "Shower", "Toiletries"],
      rates: [
        {
          name: "Deluxe Double - Standard Rate",
          priceOvernight: "501.818 VND",
          breakfast: true,
          refundable: true,
          discount: "600.000 VND",
        },
        {
          name: "Deluxe Double - Flexible Rate",
          priceOvernight: "550.000 VND",
          breakfast: true,
          refundable: true,
        },
        {
          name: "Deluxe Double - Non-refundable Rate",
          priceOvernight: "450.000 VND",
          breakfast: false,
          refundable: false,
        },
      ],
    },
    {
      mainName: "Superior Twin",
      description: "Comfortable room with twin beds, perfect for friends or family.",
      size: "28.0 m²",
      guest: "2 guests",
      images: ["/images/room-4.jpg", "/images/room-5.jpg"],
      features: ["Twin beds", "Air conditioning", "Free Wi-Fi"],
      facilities: [
        "Blackout curtains",
        "TV",
        "Safe box",
        "Tea/coffee maker",
        "Mini fridge",
      ],
      bathrooms: ["Shower", "Hairdryer", "Toiletries"],
      rates: [
        {
          name: "Superior Twin - Standard Rate",
          priceOvernight: "650.000 VND",
          breakfast: true,
          refundable: true,
          discount: "750.000 VND",
        },
        {
          name: "Superior Twin - Flexible Rate",
          priceOvernight: "700.000 VND",
          breakfast: true,
          refundable: true,
        },
        {
          name: "Superior Twin - Non-refundable Rate",
          priceOvernight: "580.000 VND",
          breakfast: false,
          refundable: false,
        },
      ],
    },
    {
      mainName: "Executive Suite",
      description: "Luxury suite with city view, ideal for business travelers.",
      size: "45.0 m²",
      guest: "3 guests",
      images: ["/images/room-6.jpg", "/images/room-7.jpg"],
      features: ["City view", "Living area", "Work desk"],
      facilities: [
        "Sofa",
        "Coffee machine",
        "Minibar",
        "Large wardrobe",
        "Premium TV channels",
      ],
      bathrooms: ["Bathtub", "Shower", "Luxury toiletries"],
      rates: [
        {
          name: "Executive Suite - Standard Rate",
          priceOvernight: "1.200.000 VND",
          breakfast: true,
          refundable: false,
          discount: "1.300.000 VND",
        },
        {
          name: "Executive Suite - Flexible Rate",
          priceOvernight: "1.250.000 VND",
          breakfast: true,
          refundable: true,
        },
        {
          name: "Executive Suite - Non-refundable Rate",
          priceOvernight: "1.100.000 VND",
          breakfast: false,
          refundable: false,
        },
      ],
    },
    {
      mainName: "Family Suite",
      description: "Spacious family suite with bunk beds, suitable for families.",
      size: "53.0 m²",
      guest: "4 guests",
      images: ["/images/room-8.jpg", "/images/room-9.jpg"],
      features: ["Bunk beds", "Spacious layout", "Soundproof"],
      facilities: ["Microwave", "Refrigerator", "TV", "Play area for kids"],
      bathrooms: ["Shower", "Toiletries", "Private bathroom"],
      rates: [
        {
          name: "Family Suite - Room Only - Semi-flexible Rate",
          priceOvernight: "3.707.871 VND",
          breakfast: false,
          refundable: true,
          discount: "5.005.255 VND",
        },
        {
          name: "Family Suite - Breakfast - Semi-flexible Rate",
          priceOvernight: "4.054.190 VND",
          breakfast: true,
          refundable: true,
          discount: "4.372.392 VND",
        },
        {
          name: "Family Suite - Breakfast - Flexible Rate",
          priceOvernight: "6.840.941 VND",
          breakfast: true,
          refundable: true,
          discount: "7.000.000 VND",
        },
      ],
    },
    {
      mainName: "Presidential Suite",
      description:
        "The most luxurious suite with premium facilities, exclusive for VIP guests.",
      size: "100.0 m²",
      guest: "2 guests",
      images: ["/images/room-10.jpg", "/images/room-11.jpg"],
      features: ["Panoramic city view", "Private dining area", "Jacuzzi"],
      facilities: [
        "Personal butler service",
        "Large living room",
        "Wine fridge",
        "Premium sound system",
      ],
      bathrooms: ["Jacuzzi", "Rain shower", "Luxury bath amenities"],
      rates: [
        {
          name: "Presidential Suite - Standard Rate",
          priceOvernight: "3.000.000 VND",
          breakfast: true,
          refundable: false,
          discount: "3.200.000 VND",
        },
        {
          name: "Presidential Suite - Flexible Rate",
          priceOvernight: "3.100.000 VND",
          breakfast: true,
          refundable: true,
        },
        {
          name: "Presidential Suite - Non-refundable Rate",
          priceOvernight: "2.800.000 VND",
          breakfast: false,
          refundable: false,
        },
      ],
    },
  ];

  const amenities = [
    "Free Wi-Fi",
    "Parking",
    "Swimming pool",
    "24/7 room service",
    "Spa & Massage",
    "Restaurant",
    "Fitness Center",
  ];

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

  const handleScroll = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleShowDetail = (room: RoomOption, rateIndex: number) => {
    setSelectedRoom(room);
    setSelectedRateIndex(rateIndex);
    setShowDetail(true);
  };

  const roomRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  if (roomRefs.current.length !== roomOptions.length) {
    roomRefs.current = Array(roomOptions.length)
      .fill(null)
      .map(() => React.createRef<HTMLDivElement>());
  }

  const handleTypeRoomClick = (index: number) => {
    roomRefs.current[index].current?.scrollIntoView({ behavior: "smooth" });
    setSelectedRoomIndex(index);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Gallery & Info */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <Carousel
            showThumbs={true}
            autoPlay
            infiniteLoop
            showStatus={false}
            dynamicHeight={false}
            thumbWidth={80}
          >
            {images.map((img, idx) => (
              <div key={idx} className="relative w-full">
                <img
                  src={img}
                  alt={`Image ${idx}`}
                  className="w-full h-[400px] object-cover rounded-xl shadow"
                />
              </div>
            ))}
          </Carousel>

          <style>
            {`
        .carousel .thumbs-wrapper {
          margin-top: 10px;
        }
        .carousel .thumb {
          margin-right: 6px;
          border: 2px solid transparent;
          border-radius: 8px;
          overflow: hidden;
          width: 80px !important;
          height: 60px !important;
          transition: border 0.3s ease;
        }
        .carousel .thumb img {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
        .carousel .thumb.selected,
        .carousel .thumb:hover {
          border: 2px solid #3b82f6;
        }
      `}
          </style>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Luxury Saigon Hotel</h1>
            <div className="flex items-center text-gray-500 mb-1">
              <MapPinIcon className="w-5 h-5 mr-1" />
              <span>123 Le Loi, District 1, Ho Chi Minh City</span>
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
              Modern hotel, fully equipped, near the center, convenient for
              travel and business.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {amenities.map((item, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Sections */}
      <div ref={overviewRef} className="mt-6">
        <h2 className="text-xl font-bold mb-4">Introduction</h2>
        <p className="text-gray-700">
          Luxury Saigon Hotel offers a luxurious space, close to famous
          attractions such as Notre Dame Cathedral and Ben Thanh Market.
          Suitable for both tourists and business travelers.
        </p>
      </div>
 <div ref={roomsRef} className="mt-8">
  <h2 className="text-2xl font-bold mb-8 text-gray-800">Room Options</h2>
  <div className="grid gap-8">
    {roomOptions.map((option, idx) => (
      <div
        key={idx}
        ref={roomRefs.current[idx]}
        className="border border-gray-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white flex flex-col lg:flex-row"
      >
        {/* Image & Features */}
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

          {/* New: Room size & features block below image */}
          <div className="mt-3 text-sm text-gray-600 flex flex-col space-y-1">
            <div className="flex items-center font-medium text-gray-700">
              <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2">
                {option.size}
              </span>
              Room size
            </div>
            {option.features.map((feature, featureIdx) => (
              <span key={featureIdx} className="flex items-center">
                <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 lg:pl-8 flex flex-col">
          <h3 className="font-semibold text-xl mb-4 text-gray-800">{option.mainName}</h3>

          {/* Header row */}
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 border-b pb-2 mb-2">
            <div>Room Selection</div>
            <div>Guest Limit</div>
            <div>Price</div>
            <div>Choose</div>
          </div>

          {/* Rates row */}
          {option.rates.map((rate, rateIdx) => (
            <div
              key={rateIdx}
              className="grid grid-cols-4 gap-4 text-sm items-center border-b py-3 last:border-0"
            >
              {/* Room Selection */}
              <div className="text-gray-700">{rate.name}</div>

              {/* Guest */}
              <div className="flex items-center text-gray-700">
                <UsersIcon className="w-5 h-5 mr-1 text-blue-500" />
                {option.guest}
              </div>

              {/* Price */}
              <div>
                {rate.discount && (
                  <p className="text-xs text-red-500 line-through mb-1">{rate.discount}</p>
                )}
                <p className="font-semibold text-blue-600">{rate.priceOvernight}</p>
                {rate.discount && (
                  <span className="text-green-600 text-xs block">
                    Save {(parseInt(rate.discount.replace(/[^\d]/g, '')) - parseInt(rate.priceOvernight.replace(/[^\d]/g, ''))) / 1000}k VND
                  </span>
                )}
                {!rate.refundable && (
                  <span className="text-red-500 text-xs block mt-1">Non-refundable</span>
                )}
                {rate.breakfast && (
                  <span className="text-green-600 text-xs block mt-1">Breakfast included</span>
                )}
              </div>

              {/* Choose */}
              <div>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs w-full hover:bg-blue-700 transition flex items-center justify-center"
                  onClick={() => handleShowDetail(option, rateIdx)}
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


      <div className="relative inline-block mt-10 mb-4">
        <select
          value={selectedRoomIndex ?? ""}
          onChange={(e) => handleTypeRoomClick(Number(e.target.value))}
          className="border border-gray-300 px-4 py-2 rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select room type</option>
          {roomOptions.map((room, idx) => (
            <option key={idx} value={idx}>
              {room.mainName}
            </option>
          ))}
        </select>
      </div>

      <div ref={locationRef} className="mt-10">
        <h2 className="text-xl font-bold mb-4">Location</h2>
        <p className="text-gray-700 mb-4">
          Located in the heart of District 1, convenient to major attractions.
        </p>
        <div className="w-full h-96 rounded-xl overflow-hidden shadow">
          <iframe
            title="Hotel Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4094968425957!2d106.69917927481854!3d10.778743059161026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3edb68ddfd%3A0xa1b21781e331dba5!2sBen%20Thanh%20Market!5e0!3m2!1sen!2s!4v1685270875149!5m2!1sen!2s"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <div ref={reviewsRef} className="mt-10">
        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        {reviews.map((r, idx) => (
          <div key={idx} className="mb-3">
            <p className="font-medium">
              {r.name} ({r.rating}⭐):
            </p>
            <p className="text-gray-700">{r.comment}</p>
          </div>
        ))}
      </div>

      <div ref={policyRef} className="mt-10">
        <h2 className="text-xl font-bold mb-4">Policy</h2>
        <p className="text-gray-700">
          Check-in from 14:00, check-out before 12:00. Cancellation policy
          flexible.
        </p>
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
                  autoPlay
                  infiniteLoop
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
                  <h3 className="font-semibold mb-2">Room Information</h3>
                  <div className="flex items-center gap-4 mb-1">
                    <span>📐 {selectedRoom.size}</span>
                    <span>👥 {selectedRoom.guest}</span>
                  </div>
                </div>
                <hr className="my-2" />
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Room Features</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedRoom.features.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <hr className="my-2" />
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Facilities</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedRoom.facilities.map((item, idx) => (
                      <li key={idx}>{item}</li>
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
                    {selectedRoom.rates[selectedRateIndex].priceOvernight} /
                    room / night
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition mt-2">
                    Choose
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}