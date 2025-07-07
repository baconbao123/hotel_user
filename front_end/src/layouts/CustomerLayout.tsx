import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Bell, Calendar, ChevronDown, Heart, LogIn, LogOut, Search, ShoppingBag, User } from 'lucide-react';
import PageWrapper from '@/components/common/PageWrapper';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

type CustomerLayoutProps = {
  children: React.ReactNode;
  isLoggedIn?: boolean;
};

export const CustomerLayout = ({ children, isLoggedIn = false }: CustomerLayoutProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <PageWrapper>
        <Navbar />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="md:hidden bg-white p-4 shadow-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search hotels, destinations..."
              className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 focus:ring-2 focus:ring-shopee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </PageWrapper>
  );
};

export default CustomerLayout;
