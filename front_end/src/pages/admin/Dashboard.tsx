
import React, { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import StatCard from '@/components/admin/StatCard';
import RevenueChart from '@/components/admin/RevenueChart';
import BookingsPieChart from '@/components/admin/BookingsPieChart';
import RecentBookings from '@/components/admin/RecentBookings';
import { Hotel, LineChart, ShoppingBag, Users } from 'lucide-react';
import { useBookings } from '@/api/hooks/useBookings';
import { useHotels } from '@/api/hooks/useHotels';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard = () => {
  // In a real application, this data would come from API calls
  // For now we're using mock data but set up to easily replace with real API calls
  const [isLoading, setIsLoading] = useState(false);
  
  // These hooks can be uncommented when the backend API is ready
  // const { data: bookingsData, isLoading: bookingsLoading } = useBookings();
  // const { data: hotelsData, isLoading: hotelsLoading } = useHotels();
  
  return (
    <DashboardLayout userType="admin">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {isLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Users"
              value="12,854"
              icon={<Users size={20} />}
              description="Total users in the system"
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Hotels"
              value="347"
              icon={<Hotel size={20} />}
              description="Total hotels registered"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Bookings"
              value="4,521"
              icon={<ShoppingBag size={20} />}
              description="Total bookings made"
              trend={{ value: 15, isPositive: true }}
            />
            <StatCard
              title="Revenue"
              value="$386,245"
              icon={<LineChart size={20} />}
              description="Total platform revenue"
              trend={{ value: 5, isPositive: false }}
            />
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {isLoading ? (
          <>
            <Skeleton className="h-80 xl:col-span-2" />
            <Skeleton className="h-80" />
          </>
        ) : (
          <>
            <RevenueChart />
            <BookingsPieChart />
          </>
        )}
      </div>
      
      {isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <RecentBookings />
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
