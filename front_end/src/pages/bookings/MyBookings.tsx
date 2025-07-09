import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { CustomerLayout } from "@/layouts/CustomerLayout";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setHotels } from '@/store/slice/commonDataSlice';
import { Modal, Descriptions, Result } from 'antd';
import { Button } from "@/components/ui/button";

interface Booking {
  id: number;
  userId: number;
  roomId: number;
  paymentId: number;
  checkInTime: string;
  checkOutTime: string;
  actualCheckInTime: string | null;
  actualCheckOutTime: string | null;
  note: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string | null;
  createdBy: number;
  updatedBy: number | null;
  deletedAt: string | null;
}

interface DecodedToken {
  userId: number; // Adjust based on your token's structure
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const userId = useSelector((state: RootState) => state.userDataSlice.id);
  const userName = useSelector((state: RootState) => state.userDataSlice.fullname);
  const email = useSelector((state: RootState) => state.userDataSlice.email);
  const phoneNumber = useSelector((state: RootState) => state.userDataSlice.phoneNumber);
  const avatarUrl = useSelector((state: RootState) => state.userDataSlice.avatarUrl);
  const hotelDetail = useSelector((state: RootState) => state.commonData.hotelDetail);
  const hotels = useSelector((state: RootState) => state.commonData.hotels || []);
  const dispatch = useDispatch();
  const [hotelDetailsMap, setHotelDetailsMap] = useState<{ [roomId: number]: any }>({});
  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState<any>(null);
  const billRef = useRef<HTMLDivElement>(null);

  const getHotelByRoomId = (roomId: number) => {
    for (const hotel of hotels) {
      if (hotel.rooms?.some((room: any) => room.id === roomId)) {
        return hotel;
      }
    }
    return null;
  };

  const handleCancelBooking = async (bookingId: number) => {
    const token = Cookies.get("token");
    if (!token) {
      toast({ title: "Error", description: "No authentication token found.", variant: "destructive" });
      return;
    }
    try {
      await axios.post(`http://103.161.172.90:9898/hotel/booking/user/cancel/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Success", description: "Booking cancelled successfully." });
      fetchBookings();
    } catch (error) {
      toast({ title: "Error", description: "Failed to cancel booking.", variant: "destructive" });
    }
  };

  const fetchBookings = async () => {
    const token = Cookies.get("token");
    if (!token && userId) {
      toast({
        title: "Error",
        description: "No authentication token found.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Decode token to get userId with error handling
      try {
        // const decoded: DecodedToken = jwtDecode(token) as DecodedToken; // Type assertion
        // userId = decoded.userId;
      } catch (decodeError) {
        toast({
          title: "Error",
          description: "Invalid authentication token.",
          variant: "destructive",
        });
        return;
      }

      const res = await axios.get(
        `http://103.161.172.90:9898/hotel/booking/user/${userId}/booking`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(res.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHotelsIfNeeded = async () => {
    if (!hotels || hotels.length === 0) {
      try {
        const res = await axios.get('http://103.161.172.90:9898/hotel/user/home?page=0');
        const hotelsArray = res.data?.result?.hotels?.content || [];
        dispatch(setHotels(hotelsArray));
      } catch (e) {
        // silent fail
      }
    }
  };

  const fetchHotelDetailByRoomId = async (roomId: number) => {
    try {
      const res = await axios.get(`http://103.161.172.90:9898/hotel/room/${roomId}`);
      console.log('API /hotel/room/', roomId, res.data);
      setHotelDetailsMap(prev => ({ ...prev, [roomId]: res.data }));
    } catch (e) {
      // silent fail
    }
  };

  useEffect(() => {
    console.log("check usser id ", userId, "userName", userName , "email", email);
    fetchBookings();
    fetchHotelsIfNeeded();
  }, [userId, userName]);

  // Fetch chi tiết hotel cho các roomId chưa có thông tin
  useEffect(() => {
    const missingRoomIds = bookings
      .map(b => b.roomId)
      .filter(roomId => {
        const hotel = getHotelByRoomId(roomId);
        return !hotel && !hotelDetailsMap[roomId];
      });
    missingRoomIds.forEach(roomId => {
      fetchHotelDetailByRoomId(roomId);
    });
    // eslint-disable-next-line
  }, [bookings, hotels, hotelDetailsMap]);

  const handleViewBill = () => {
    const hotelDetailObj = hotelDetailsMap[bookings[0].roomId];
    const hotelObj = hotelDetailObj?.result?.hotel || hotelDetailObj?.hotel;
    const roomObj = hotelDetailObj?.result?.room || hotelDetailObj?.room;
    const hotelName = hotelObj?.name || getHotelByRoomId(bookings[0].roomId)?.name || '';
    const hotelAddress = hotelObj?.address || getHotelByRoomId(bookings[0].roomId)?.address || '';
    const roomName = roomObj?.name || getHotelByRoomId(bookings[0].roomId)?.rooms?.find((room: any) => room.id === bookings[0].roomId)?.name || '';

    setBillData({
      bookingId: bookings[0].id,
      roomId: bookings[0].roomId,
      checkInTime: bookings[0].checkInTime,
      checkOutTime: bookings[0].checkOutTime,
      amount: 0,
      method: bookings[0].paymentId || 'Payment',
      guest: {
        name: userName,
        email: email,
        phoneNumber: phoneNumber,
        avatarUrl: avatarUrl
      },
      note: bookings[0].note,
      hotelName,
      roomName,
      hotelAddress,
    });
    setShowBill(true);
  };

  return (
    <CustomerLayout>
      <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-4xl mx-auto shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              My Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-6">
                {bookings.map((booking) => {
                  let hotel = getHotelByRoomId(booking.roomId);
                  let room = hotel?.rooms?.find((room: any) => room.id === booking.roomId);

                  if (!hotel && hotelDetailsMap[booking.roomId]) {
                    hotel = hotelDetailsMap[booking.roomId].hotel;
                    room = hotelDetailsMap[booking.roomId].room;
                  }

                  const hotelDetailObj = hotelDetailsMap[booking.roomId];
                  const hotelObj = hotelDetailObj?.result?.hotel || hotelDetailObj?.hotel;
                  const roomObj = hotelDetailObj?.result?.room || hotelDetailObj?.room;
                  const hotelName = hotelObj?.name || hotel?.name || '';
                  const hotelAddress = hotelObj?.address || hotel?.address || '';
                  const roomName = roomObj?.name || room?.name || '';

                  const handleViewBill = () => {
                    setBillData({
                      bookingId: booking.id,
                      roomId: booking.roomId,
                      checkInTime: booking.checkInTime,
                      checkOutTime: booking.checkOutTime,
                      amount: 0,
                      method: booking.paymentId || 'Payment',
                      guest: {
                        name: userName,
                        email: email,
                        phoneNumber: phoneNumber,
                        avatarUrl: avatarUrl
                      },
                      note: booking.note,
                      hotelName,
                      roomName,
                      hotelAddress,
                    });
                    setShowBill(true);
                  };

                  return (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          {hotel?.avatarUrl ? (
                            <img src={hotel.avatarUrl.startsWith('http') ? hotel.avatarUrl : `${import.meta.env.VITE_REACT_APP_BACK_END_UPLOAD_HOTEL}/${hotel.avatarUrl}`} alt="hotel avatar" className="w-14 h-14 rounded object-cover border" />
                          ) : (
                            <div className="w-14 h-14 rounded bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                          )}
                          <div>
                            <div className="font-semibold text-base">{hotel?.name || 'Unknown Hotel'}</div>
                            <div className="text-sm text-gray-700">{hotel?.address || 'No address'}</div>
                            {room && <div className="text-sm text-gray-500">Room: {room.name}</div>}
                            {!hotel && <div className="text-xs text-red-500">Hotel info not found</div>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg text-blue-700">{userName}</div>
                          <div className="text-sm text-gray-700">{email}</div>
                          <div className="text-sm text-gray-700">{phoneNumber}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600"><strong>Booking ID:</strong> {booking.id}</p>
                          <p className="text-sm font-medium text-gray-600"><strong>Room ID:</strong> {booking.roomId}</p>
                          <p className="text-sm font-medium text-gray-600"><strong>Payment ID:</strong> {booking.paymentId}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600"><strong>Check In:</strong> {new Date(booking.checkInTime).toLocaleString()}</p>
                          <p className="text-sm font-medium text-gray-600"><strong>Check Out:</strong> {new Date(booking.checkOutTime).toLocaleString()}</p>
                          <p className="text-sm font-medium text-gray-600">
                            <strong>Status:</strong>
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${booking.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {booking.status ? "Active" : "Inactive"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        {/* <div>
                          <p className="text-sm font-medium text-gray-600"><strong>Created At:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                          {booking.note && (
                            <p className="text-sm font-medium text-gray-600"><strong>Note:</strong> {booking.note}</p>
                          )}
                        </div> */}
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                          onClick={handleViewBill}
                        >
                          View Bill
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-lg">
                No bookings found.
              </p>
            )}
          </CardContent>
        </Card>
        {/* Modal Bill */}
        <Modal open={showBill} onCancel={() => setShowBill(false)} footer={null} width={500} centered>
          <div ref={billRef} style={{ background: '#fff', padding: 16 }}>
            <Result
              status="success"
              title="Booking Successful!"
              subTitle={billData?.bookingId ? `Booking ID: ${billData.bookingId}` : ''}
            />
            <Descriptions column={1} bordered size="middle">
              <Descriptions.Item label="Hotel Name">{billData?.hotelName}</Descriptions.Item>
              <Descriptions.Item label="Room Name">{billData?.roomName}</Descriptions.Item>
              <Descriptions.Item label="Hotel Address">{billData?.hotelAddress}</Descriptions.Item>
              <Descriptions.Item label="Guest Name">{billData?.guest?.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{billData?.guest?.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{billData?.guest?.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="Room ID">{billData?.roomId}</Descriptions.Item>
              <Descriptions.Item label="Check-in">{billData?.checkInTime}</Descriptions.Item>
              <Descriptions.Item label="Check-out">{billData?.checkOutTime}</Descriptions.Item>
              <Descriptions.Item label="Amount">{billData?.amount?.toLocaleString()}₫</Descriptions.Item>
              <Descriptions.Item label="Payment Method">{billData?.method}</Descriptions.Item>
              {billData?.note && <Descriptions.Item label="Note">{billData?.note}</Descriptions.Item>}
            </Descriptions>
          </div>
          <div className="flex justify-center mt-6 gap-3">
            <Button onClick={() => setShowBill(false)} style={{ borderColor: '#FF6600', color: '#FF6600' }}>Close</Button>
          </div>
        </Modal>
      </div>
    </CustomerLayout>
  );
};

export default MyBookings;
