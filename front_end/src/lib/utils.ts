import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from "js-cookie"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to check if user is authenticated
export function isAuthenticated(): boolean {
  const token = Cookies.get('token');
  return !!token;
}

// Utility function to get token from cookies
export function getAuthToken(): string | undefined {
  return Cookies.get('token');
}

// Utility function to redirect to login with return URL
export function redirectToLogin(returnUrl?: string): void {
  const currentUrl = window.location.pathname + window.location.search;
  const loginUrl = `/login${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : `?returnUrl=${encodeURIComponent(currentUrl)}`}`;
  window.location.href = loginUrl;
}
