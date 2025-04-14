
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AdminLoginInfo = () => {
  const [activeTab, setActiveTab] = useState('admin');
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Account Details</CardTitle>
        <CardDescription>
          Use these credentials to access different dashboards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="admin" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="owner">Hotel Owner</TabsTrigger>
          </TabsList>
          
          <TabsContent value="admin" className="space-y-4 mt-4">
            <div>
              <p className="font-medium">Email:</p>
              <p className="text-muted-foreground">admin@hospitopia.com</p>
            </div>
            <Separator />
            <div>
              <p className="font-medium">Password:</p>
              <p className="text-muted-foreground">admin123</p>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground mt-4">
              After logging in, you'll be redirected to the admin dashboard where you can manage users, hotels, bookings, and view financial data.
            </p>
          </TabsContent>
          
          <TabsContent value="owner" className="space-y-4 mt-4">
            <div>
              <p className="font-medium">Email:</p>
              <p className="text-muted-foreground">owner@hospitopia.com</p>
            </div>
            <Separator />
            <div>
              <p className="font-medium">Password:</p>
              <p className="text-muted-foreground">owner123</p>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground mt-4">
              After logging in, you'll be redirected to the hotel owner dashboard where you can manage your hotels, rooms, bookings, and view financial data.
            </p>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 bg-yellow-50 p-3 rounded-md border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> These are simulated accounts for demonstration purposes. In a production environment, these credentials would never be shared openly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLoginInfo;
