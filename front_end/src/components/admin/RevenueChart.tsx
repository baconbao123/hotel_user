
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const chartData = {
  daily: [
    { name: 'Mon', revenue: 4000, bookings: 24 },
    { name: 'Tue', revenue: 3000, bookings: 18 },
    { name: 'Wed', revenue: 2000, bookings: 12 },
    { name: 'Thu', revenue: 2780, bookings: 19 },
    { name: 'Fri', revenue: 1890, bookings: 14 },
    { name: 'Sat', revenue: 2390, bookings: 20 },
    { name: 'Sun', revenue: 3490, bookings: 28 },
  ],
  monthly: [
    { name: 'Jan', revenue: 24000, bookings: 120 },
    { name: 'Feb', revenue: 18000, bookings: 98 },
    { name: 'Mar', revenue: 32000, bookings: 145 },
    { name: 'Apr', revenue: 27800, bookings: 132 },
    { name: 'May', revenue: 18900, bookings: 88 },
    { name: 'Jun', revenue: 23900, bookings: 110 },
  ],
  yearly: [
    { name: '2019', revenue: 240000, bookings: 1200 },
    { name: '2020', revenue: 180000, bookings: 980 },
    { name: '2021', revenue: 320000, bookings: 1450 },
    { name: '2022', revenue: 278000, bookings: 1320 },
    { name: '2023', revenue: 389000, bookings: 1880 },
  ],
};

export const RevenueChart = () => {
  return (
    <Card className="col-span-full xl:col-span-2">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>View booking revenue over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList className="mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          {Object.entries(chartData).map(([period, data]) => (
            <TabsContent key={period} value={period} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #f0f0f0',
                      borderRadius: '6px',
                      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    fill="#1e3a8a"
                    name="Revenue"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="bookings"
                    fill="#ee4d2d"
                    name="Bookings"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
