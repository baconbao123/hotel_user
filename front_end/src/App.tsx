import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerHomePage from "./pages/customer/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import HotelDetail from "./pages/hotel/HotelDetail";
import UserHome from "./pages/user/Home";
import ProfileUser from "./pages/profileUser/ProfileUser";
import MyBookings from "./pages/bookings/MyBookings";
import axios from "axios";
import Cookies from "js-cookie";

axios.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

axios.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    window.location.href = "/login";
  }
  return Promise.reject(error);
});

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CustomerHomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/home" element={<UserHome />} />
          <Route path="/hotel/:hotelId" element={<HotelDetail />} />
          <Route path="/user/profile" element={<ProfileUser />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;