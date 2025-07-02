import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerHomePage from "./pages/customer/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import OwnerDashboard from "./pages/owner/Dashboard";
import NotFound from "./pages/NotFound";
import UserHome from "./pages/user/Home";
import HotelDetail from "./components/customer/HotelDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerHomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/home" element={<UserHome />} />
          <Route path="/hotel/:id" element={<HotelDetail />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Hotel Owner Routes */}
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
