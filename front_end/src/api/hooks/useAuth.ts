
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '../endpoints';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse, 
  User, 
  ForgotPasswordRequest, 
  ResetPasswordRequest 
} from '../types/auth';
import { useToast } from '@/hooks/use-toast';

export const useLogin = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user);
      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.user.firstName}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'An error occurred during login',
        variant: 'destructive',
      });
    },
  });

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  };

  return {
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
    user,
  };
};

export const useRegister = () => {
  const { toast } = useToast();
  
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterRequest): Promise<RegisterResponse> => {
      const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      toast({
        title: 'Registration successful',
        description: `Welcome to Hospitopia, ${data.user.firstName}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'An error occurred during registration',
        variant: 'destructive',
      });
    },
  });

  return {
    register: registerMutation.mutate,
    isLoading: registerMutation.isPending,
  };
};

export const useCurrentUser = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get(USER_ENDPOINTS.GET_PROFILE);
      return response.data.user;
    },
    enabled: !!localStorage.getItem('authToken'),
    retry: 1,
    meta: {
      onError: (error: any) => {
        if (error.response?.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem('authToken');
        } else {
          toast({
            title: 'Error',
            description: 'Failed to fetch user profile',
            variant: 'destructive',
          });
        }
      }
    },
  });
};

export const useForgotPassword = () => {
  const { toast } = useToast();
  
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Reset email sent',
        description: 'Check your email for password reset instructions',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Request failed',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  return {
    forgotPassword: forgotPasswordMutation.mutate,
    isLoading: forgotPasswordMutation.isPending,
  };
};

export const useResetPassword = () => {
  const { toast } = useToast();
  
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Password reset successful',
        description: 'You can now log in with your new password',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Reset failed',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  return {
    resetPassword: resetPasswordMutation.mutate,
    isLoading: resetPasswordMutation.isPending,
  };
};
