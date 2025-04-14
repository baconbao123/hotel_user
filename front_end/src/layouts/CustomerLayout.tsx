
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

type CustomerLayoutProps = {
  children: React.ReactNode;
  isLoggedIn?: boolean;
};

export const CustomerLayout = ({ children, isLoggedIn = false }: CustomerLayoutProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-hotel-blue sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <h1 className="text-xl font-bold text-white">
                  Hospitopia <span className="text-shopee">Hub</span>
                </h1>
              </a>
            </div>
            <div className="flex-1 max-w-lg mx-8 hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search hotels, destinations..."
                  className="pl-10 pr-4 py-2 w-full rounded-full border-none focus:ring-2 focus:ring-shopee"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/favorites" className="text-white hidden lg:flex items-center">
                <Heart className="h-5 w-5 mr-1" />
                <span>Favorites</span>
              </a>
              <a href="/bookings" className="text-white hidden lg:flex items-center">
                <ShoppingBag className="h-5 w-5 mr-1" />
                <span>My Bookings</span>
              </a>
              
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative text-white flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-block">John Doe</span>
                      <ChevronDown className="h-4 w-4" />
                      <span className="absolute top-0 right-0 h-3 w-3 bg-shopee rounded-full"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ShoppingBag className="mr-2 h-4 w-4" /> My Bookings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Heart className="mr-2 h-4 w-4" /> Favorites
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" className="text-white" asChild>
                    <a href="/login">
                      <LogIn className="h-5 w-5 mr-1" />
                      <span>Login</span>
                    </a>
                  </Button>
                  <Button className="bg-shopee hover:bg-shopee-dark" asChild>
                    <a href="/register">Register</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

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

      <footer className="bg-gray-800 text-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Hospitopia Hub</h3>
              <p className="text-gray-300">
                We provide the best hotel booking experience with a wide range of options and competitive prices.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
                <li><a href="/hotels" className="text-gray-300 hover:text-white">Browse Hotels</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <address className="text-gray-300 not-italic">
                <p>123 Booking Street</p>
                <p>Hotel District, 10000</p>
                <p className="mt-2">Email: info@hospitopia.com</p>
                <p>Phone: +1 234 567 890</p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} Hospitopia Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
