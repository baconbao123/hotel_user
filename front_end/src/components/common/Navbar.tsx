import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Calendar, ChevronDown, Heart, LogIn, LogOut, Search, ShoppingBag, User } from 'lucide-react';

const Navbar = ({ isLoggedIn = false }: { isLoggedIn?: boolean }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? 'bg-hotel-blue shadow-md'
          : 'bg-hotel-blue shadow-md'
      }`}
      style={{
        backdropFilter: !scrolled ? 'blur(16px)' : undefined,
        WebkitBackdropFilter: !scrolled ? 'blur(16px)' : undefined,
      }}
    >
      <div className="w-full container ">
        <div className="flex justify-between h-16 items-center px-4 sm:px-6 lg:px-8">
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
  );
};

export default Navbar; 