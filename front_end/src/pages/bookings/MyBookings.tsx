import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { CustomerLayout } from "@/layouts/CustomerLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
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
  const userName = useSelector(
    (state: RootState) => state.userDataSlice.fullname
  );
  const email = useSelector(
    (state: RootState) => state.userDataSlice.email
  )

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
        `http://localhost:9898/hotel/booking/user/${userId}/booking`,
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
  useEffect(() => {
    console.log("check usser id ", userId, "userName", userName , "email", email);

    fetchBookings();
  }, [userId, userName]);

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
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          <strong>Booking ID:</strong> {booking.id}
                        </p>
                        <p className="text-sm font-medium text-gray-600">
                          <strong>Room ID:</strong> {booking.roomId}
                        </p>
                        <p className="text-sm font-medium text-gray-600">
                          <strong>Payment ID:</strong> {booking.paymentId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          <strong>Check In:</strong>{" "}
                          {new Date(booking.checkInTime).toLocaleString()}
                        </p>
                        <p className="text-sm font-medium text-gray-600">
                          <strong>Check Out:</strong>{" "}
                          {new Date(booking.checkOutTime).toLocaleString()}
                        </p>
                        <p className="text-sm font-medium text-gray-600">
                          <strong>Status:</strong>{" "}
                          <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status ? "Active" : "Inactive"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-600">
                        <strong>Created At:</strong>{" "}
                        {new Date(booking.createdAt).toLocaleString()}
                      </p>
                      {booking.note && (
                        <p className="text-sm font-medium text-gray-600">
                          <strong>Note:</strong> {booking.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-lg">
                No bookings found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default MyBookings;
