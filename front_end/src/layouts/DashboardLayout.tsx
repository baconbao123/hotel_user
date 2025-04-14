
import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, ChevronDown, Home, Hotel, LogOut, Settings, ShoppingBag, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

type DashboardLayoutProps = {
  children: React.ReactNode;
  userType: 'admin' | 'hotelOwner';
};

export const DashboardLayout = ({ children, userType }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [notifications, setNotifications] = useState<number>(3);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar userType={userType} />
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center">
              {isMobile && <SidebarTrigger />}
              <h1 className="text-xl font-semibold text-hotel-blue ml-2">
                Hospitopia <span className="text-shopee">Hub</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-shopee text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block text-sm font-medium">
                      {userType === 'admin' ? 'Admin User' : 'Hotel Owner'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const DashboardSidebar = ({ userType }: { userType: 'admin' | 'hotelOwner' }) => {
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="h-16 flex items-center px-4">
        <div className="flex-1 text-center">
          <h2 className="text-lg font-bold text-white">
            {userType === 'admin' ? 'Admin Panel' : 'Owner Panel'}
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <AdminMenuItems userType={userType} />
      </SidebarContent>
      <SidebarFooter className="h-16 flex items-center justify-center">
        <Button variant="ghost" size="sm" className="w-full mx-4 text-white">
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

const AdminMenuItems = ({ userType }: { userType: 'admin' | 'hotelOwner' }) => {
  const adminMenuItems = [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Users, label: 'User Management', href: '/admin/users' },
    { icon: Hotel, label: 'Hotel Management', href: '/admin/hotels' },
    { icon: ShoppingBag, label: 'Booking Management', href: '/admin/bookings' },
    { icon: Settings, label: 'Financial', href: '/admin/financial' },
  ];

  const hotelOwnerMenuItems = [
    { icon: Home, label: 'Dashboard', href: '/owner/dashboard' },
    { icon: Hotel, label: 'My Hotels', href: '/owner/hotels' },
    { icon: ShoppingBag, label: 'Room Management', href: '/owner/rooms' },
    { icon: Users, label: 'Booking Management', href: '/owner/bookings' },
    { icon: Settings, label: 'Financial', href: '/owner/financial' },
    { icon: Bell, label: 'Reviews', href: '/owner/reviews' },
  ];

  const menuItems = userType === 'admin' ? adminMenuItems : hotelOwnerMenuItems;

  return (
    <SidebarGroup>
      <ul className="space-y-1 px-2">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-medium text-white hover:text-white hover:bg-blue-700"
              asChild
            >
              <a href={item.href} className="flex items-center">
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </a>
            </Button>
          </li>
        ))}
      </ul>
    </SidebarGroup>
  );
};

export default DashboardLayout;
