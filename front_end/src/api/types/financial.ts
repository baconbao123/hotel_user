
export interface Revenue {
  total: number;
  period: string;
  breakdown: {
    date: string;
    amount: number;
    bookings: number;
  }[];
}

export interface Transaction {
  id: string;
  bookingId: string;
  hotelId: string;
  hotelName: string;
  userId: string;
  customerName: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'pending' | 'completed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
}

export interface RevenueResponse {
  revenue: Revenue;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}
