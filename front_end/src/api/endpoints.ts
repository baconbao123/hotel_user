
// API endpoint constants

// Auth related endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
};

// User related endpoints
export const USER_ENDPOINTS = {
  GET_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  GET_ALL: '/admin/users',
  GET_BY_ID: (id: string) => `/admin/users/${id}`,
  CREATE: '/admin/users',
  UPDATE: (id: string) => `/admin/users/${id}`,
  DELETE: (id: string) => `/admin/users/${id}`,
};

// Hotel related endpoints
export const HOTEL_ENDPOINTS = {
  GET_ALL: '/hotels',
  GET_BY_ID: (id: string) => `/hotels/${id}`,
  CREATE: '/hotels',
  UPDATE: (id: string) => `/hotels/${id}`,
  DELETE: (id: string) => `/hotels/${id}`,
  APPROVE: (id: string) => `/admin/hotels/${id}/approve`,
  REJECT: (id: string) => `/admin/hotels/${id}/reject`,
  GET_ROOMS: (id: string) => `/hotels/${id}/rooms`,
};

// Booking related endpoints
export const BOOKING_ENDPOINTS = {
  GET_ALL: '/bookings',
  GET_BY_ID: (id: string) => `/bookings/${id}`,
  CREATE: '/bookings',
  UPDATE: (id: string) => `/bookings/${id}`,
  CANCEL: (id: string) => `/bookings/${id}/cancel`,
  CONFIRM: (id: string) => `/bookings/${id}/confirm`,
  GET_USER_BOOKINGS: '/users/bookings',
  GET_HOTEL_BOOKINGS: (hotelId: string) => `/hotels/${hotelId}/bookings`,
};

// Reviews related endpoints
export const REVIEW_ENDPOINTS = {
  GET_ALL: '/reviews',
  GET_BY_ID: (id: string) => `/reviews/${id}`,
  CREATE: '/reviews',
  UPDATE: (id: string) => `/reviews/${id}`,
  DELETE: (id: string) => `/reviews/${id}`,
  GET_HOTEL_REVIEWS: (hotelId: string) => `/hotels/${hotelId}/reviews`,
};

// Financial related endpoints
export const FINANCIAL_ENDPOINTS = {
  GET_ADMIN_REVENUE: '/admin/financial/revenue',
  GET_HOTEL_REVENUE: (hotelId: string) => `/hotels/${hotelId}/financial/revenue`,
  GET_ADMIN_TRANSACTIONS: '/admin/financial/transactions',
  GET_HOTEL_TRANSACTIONS: (hotelId: string) => `/hotels/${hotelId}/financial/transactions`,
};
