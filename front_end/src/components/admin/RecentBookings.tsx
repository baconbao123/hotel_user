
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type BookingStatus = 'pending' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  customerName: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  amount: string;
  status: BookingStatus;
  avatar?: string;
}

const bookings: Booking[] = [
  {
    id: 'B001',
    customerName: 'John Doe',
    hotelName: 'Grand Hotel Luxury',
    checkIn: '2023-06-12',
    checkOut: '2023-06-15',
    amount: '$450',
    status: 'completed',
  },
  {
    id: 'B002',
    customerName: 'Sarah Smith',
    hotelName: 'Coastal Resort & Spa',
    checkIn: '2023-06-14',
    checkOut: '2023-06-18',
    amount: '$780',
    status: 'pending',
  },
  {
    id: 'B003',
    customerName: 'Michael Brown',
    hotelName: 'City Center Hotel',
    checkIn: '2023-06-10',
    checkOut: '2023-06-12',
    amount: '$320',
    status: 'cancelled',
  },
  {
    id: 'B004',
    customerName: 'Emma Wilson',
    hotelName: 'Mountain View Lodge',
    checkIn: '2023-06-15',
    checkOut: '2023-06-20',
    amount: '$950',
    status: 'pending',
  },
  {
    id: 'B005',
    customerName: 'Alex Johnson',
    hotelName: 'Riverside Hotel',
    checkIn: '2023-06-11',
    checkOut: '2023-06-13',
    amount: '$280',
    status: 'completed',
  },
];

const getStatusBadgeClass = (status: BookingStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'completed':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return '';
  }
};

export const RecentBookings = () => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>Latest bookings across all hotels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium">Booking ID</th>
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium">Hotel</th>
                <th className="px-4 py-3 text-left font-medium">Check In/Out</th>
                <th className="px-4 py-3 text-left font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{booking.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={booking.avatar || '/placeholder.svg'} alt={booking.customerName} />
                        <AvatarFallback>{booking.customerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{booking.customerName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{booking.hotelName}</td>
                  <td className="px-4 py-3">
                    {booking.checkIn} to {booking.checkOut}
                  </td>
                  <td className="px-4 py-3 font-medium">{booking.amount}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={cn('font-normal', getStatusBadgeClass(booking.status))}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentBookings;
