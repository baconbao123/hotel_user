
/**
 * Environment configuration for the application
 * This file contains environment-specific settings that can be adjusted for different deployment environments
 */

// Base API URL - will be used for all API requests
export const API_CONFIG = {
  // Base URL for API requests - change this when deploying to production
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // Request timeout in milliseconds
  TIMEOUT: 15000,
  
  // Enable detailed logging in development, disable in production
  ENABLE_LOGGING: import.meta.env.DEV || false,
}

// Authentication settings
export const AUTH_CONFIG = {
  // Name of the token in localStorage
  TOKEN_KEY: 'hospitopia_auth_token',
  
  // Token expiration time in milliseconds (default: 24 hours)
  TOKEN_EXPIRY: 86400000,
  
  // URL to redirect after login (if not specified in the redirect parameter)
  DEFAULT_LOGIN_REDIRECT: '/',
  
  // URLs for different user roles after login
  ROLE_REDIRECTS: {
    ADMIN: '/admin/dashboard',
    OWNER: '/owner/dashboard',
    CUSTOMER: '/',
  }
}

// Feature flags - easily enable/disable features based on environment
export const FEATURES = {
  // Set to true to enable demo mode with mock data
  ENABLE_DEMO_MODE: import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' || false,
  
  // Set to true to enable detailed error reporting
  ENABLE_ERROR_REPORTING: import.meta.env.PROD || false,
}

// Application metadata
export const APP_CONFIG = {
  NAME: 'Hospitopia Hub',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@hospitopia.com',
}

