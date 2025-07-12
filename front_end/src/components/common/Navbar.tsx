import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Calendar,
  ChevronDown,
  Heart,
  LogIn,
  LogOut,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import { Badge as AntdBadge } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { setUser } from "@/store/slice/userDataSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("token"));
  const [userProfile, setUserProfile] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateFavCount = () => {
      const favs = JSON.parse(localStorage.getItem("favoriteHotels") || "[]");
      setFavoriteCount(favs.length);
    };
    updateFavCount();
    window.addEventListener("storage", updateFavCount);
    window.addEventListener("favorite-hotels-changed", updateFavCount);
    return () => {
      window.removeEventListener("storage", updateFavCount);
      window.removeEventListener("favorite-hotels-changed", updateFavCount);
    };
  }, []);

  const fetchProfile = async () => {
    const token = Cookies.get("token");
    axios
      .get("http://localhost:9898/hotel/user-profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserProfile(res.data.result);
        dispatch(setUser(res.data.result));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    setIsLoggedIn(false);
    setUserProfile(null);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? "bg-hotel-blue shadow-md" : "bg-hotel-blue shadow-md"
      }`}
      style={{
        backdropFilter: !scrolled ? "blur(16px)" : undefined,
        WebkitBackdropFilter: !scrolled ? "blur(16px)" : undefined,
      }}
    >
      <div className="w-full container">
        <div className="flex justify-between h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold text-white">
                Hospitopia <span className="text-shopee">Hub</span>
              </h1>
            </Link>
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
            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/favorites")}
            >
              <AntdBadge count={favoriteCount} size="small" offset={[0, 6]}>
                <Heart className="h-6 w-6 text-white hover:text-shopee transition" />
              </AntdBadge>
            </div>
            <Link
              to="/my-bookings"
              className="text-white hidden lg:flex items-center"
            >
              <ShoppingBag className="h-5 w-5 mr-1" />
              <span>My Bookings</span>
            </Link>
            {isLoggedIn && userProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative text-white flex items-center gap-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          userProfile.avatar
                            ? `http://localhost:9898/upload/${userProfile.avatar}`
                            : "/placeholder.svg"
                        }
                        alt="User"
                      />

                      <AvatarFallback>
                        {userProfile.fullName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">
                      {userProfile.fullName || "User"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                    <span className="absolute top-0 right-0 h-3 w-3 bg-shopee rounded-full"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/user/profile")}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" className="text-white" asChild>
                  <Link to="/login">
                    <LogIn className="h-5 w-5 mr-1" />
                    <span>Login</span>
                  </Link>
                </Button>
                <Button className="bg-shopee hover:bg-shopee-dark" asChild>
                  <Link to="/register">Register</Link>
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
