
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { HOTEL_ENDPOINTS } from '../endpoints';
import { 
  Hotel, 
  HotelRequest, 
  HotelResponse, 
  HotelsResponse, 
  Room, 
  RoomRequest, 
  RoomResponse, 
  RoomsResponse 
} from '../types/hotel';
import { useToast } from '@/hooks/use-toast';

// Hotel Queries
export const useHotels = (page = 1, limit = 10, filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ['hotels', page, limit, filters],
    queryFn: async (): Promise<HotelsResponse> => {
      const response = await apiClient.get(HOTEL_ENDPOINTS.GET_ALL, {
        params: { page, limit, ...filters }
      });
      return response.data;
    }
  });
};

export const useHotelDetails = (hotelId: string) => {
  return useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: async (): Promise<HotelResponse> => {
      const response = await apiClient.get(HOTEL_ENDPOINTS.GET_BY_ID(hotelId));
      return response.data;
    },
    enabled: !!hotelId,
  });
};

export const useCreateHotel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: HotelRequest): Promise<HotelResponse> => {
      const response = await apiClient.post(HOTEL_ENDPOINTS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast({
        title: 'Hotel created',
        description: 'Your hotel has been created successfully and is pending approval',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Creation failed',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateHotel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      hotelId, 
      data 
    }: { 
      hotelId: string; 
      data: Partial<HotelRequest>; 
    }): Promise<HotelResponse> => {
      const response = await apiClient.put(HOTEL_ENDPOINTS.UPDATE(hotelId), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotel', variables.hotelId] });
      toast({
        title: 'Hotel updated',
        description: 'Hotel information has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteHotel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (hotelId: string) => {
      await apiClient.delete(HOTEL_ENDPOINTS.DELETE(hotelId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast({
        title: 'Hotel deleted',
        description: 'The hotel has been deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Deletion failed',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

export const useApproveHotel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (hotelId: string): Promise<HotelResponse> => {
      const response = await apiClient.post(HOTEL_ENDPOINTS.APPROVE(hotelId));
      return response.data;
    },
    onSuccess: (_, hotelId) => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotel', hotelId] });
      toast({
        title: 'Hotel approved',
        description: 'The hotel has been approved successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Approval failed',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

export const useRejectHotel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      hotelId, 
      reason 
    }: { 
      hotelId: string; 
      reason: string; 
    }): Promise<HotelResponse> => {
      const response = await apiClient.post(HOTEL_ENDPOINTS.REJECT(hotelId), { reason });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotel', variables.hotelId] });
      toast({
        title: 'Hotel rejected',
        description: 'The hotel has been rejected',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Rejection failed',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

// Room Queries
export const useRooms = (hotelId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['rooms', hotelId, page, limit],
    queryFn: async (): Promise<RoomsResponse> => {
      const response = await apiClient.get(HOTEL_ENDPOINTS.GET_ROOMS(hotelId), {
        params: { page, limit }
      });
      return response.data;
    },
    enabled: !!hotelId,
  });
};

export const useCreateRoom = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      hotelId, 
      roomData 
    }: { 
      hotelId: string; 
      roomData: RoomRequest; 
    }): Promise<RoomResponse> => {
      const response = await apiClient.post(HOTEL_ENDPOINTS.GET_ROOMS(hotelId), roomData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rooms', variables.hotelId] });
      toast({
        title: 'Room created',
        description: 'The room has been created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Creation failed',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateRoom = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      hotelId, 
      roomId, 
      roomData 
    }: { 
      hotelId: string; 
      roomId: string; 
      roomData: Partial<RoomRequest>; 
    }): Promise<RoomResponse> => {
      const response = await apiClient.put(`${HOTEL_ENDPOINTS.GET_ROOMS(hotelId)}/${roomId}`, roomData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rooms', variables.hotelId] });
      toast({
        title: 'Room updated',
        description: 'The room has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteRoom = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      hotelId, 
      roomId 
    }: { 
      hotelId: string; 
      roomId: string; 
    }) => {
      await apiClient.delete(`${HOTEL_ENDPOINTS.GET_ROOMS(hotelId)}/${roomId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rooms', variables.hotelId] });
      toast({
        title: 'Room deleted',
        description: 'The room has been deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Deletion failed',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};
