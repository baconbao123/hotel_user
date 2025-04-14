
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { BOOKING_ENDPOINTS } from '../endpoints';
import { 
  Booking, 
  BookingRequest, 
  BookingResponse, 
  BookingsResponse, 
  CancelBookingRequest
} from '../types/booking';
import { useToast } from '@/hooks/use-toast';

export const useBookings = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['bookings', page, limit],
    queryFn: async (): Promise<BookingsResponse> => {
      const response = await apiClient.get(BOOKING_ENDPOINTS.GET_ALL, {
        params: { page, limit }
      });
      return response.data;
    }
  });
};

export const useBookingDetails = (bookingId: string) => {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async (): Promise<BookingResponse> => {
      const response = await apiClient.get(BOOKING_ENDPOINTS.GET_BY_ID(bookingId));
      return response.data;
    },
    enabled: !!bookingId,
  });
};

export const useUserBookings = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['userBookings', page, limit],
    queryFn: async (): Promise<BookingsResponse> => {
      const response = await apiClient.get(BOOKING_ENDPOINTS.GET_USER_BOOKINGS, {
        params: { page, limit }
      });
      return response.data;
    }
  });
};

export const useHotelBookings = (hotelId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['hotelBookings', hotelId, page, limit],
    queryFn: async (): Promise<BookingsResponse> => {
      const response = await apiClient.get(BOOKING_ENDPOINTS.GET_HOTEL_BOOKINGS(hotelId), {
        params: { page, limit }
      });
      return response.data;
    },
    enabled: !!hotelId,
  });
};

export const useCreateBooking = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: BookingRequest): Promise<BookingResponse> => {
      const response = await apiClient.post(BOOKING_ENDPOINTS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      toast({
        title: 'Booking successful',
        description: 'Your booking has been created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Booking failed',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

export const useCancelBooking = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      bookingId, 
      reason 
    }: { 
      bookingId: string; 
      reason?: string 
    }): Promise<BookingResponse> => {
      const response = await apiClient.post(
        BOOKING_ENDPOINTS.CANCEL(bookingId),
        { reason } as CancelBookingRequest
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      toast({
        title: 'Booking cancelled',
        description: 'Your booking has been cancelled successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Cancellation failed',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

export const useConfirmBooking = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingId: string): Promise<BookingResponse> => {
      const response = await apiClient.post(BOOKING_ENDPOINTS.CONFIRM(bookingId));
      return response.data;
    },
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['hotelBookings'] });
      toast({
        title: 'Booking confirmed',
        description: 'The booking has been confirmed successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Confirmation failed',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};
