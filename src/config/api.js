// Try to get the API URL from environment variables, with fallbacks
// The order of these URLs is important - we'll try them in order until one works
const POSSIBLE_API_URLS = [
  import.meta.env.VITE_API_URL,
  'https://property-listings-production.railway.app',
  'https://property-listings.up.railway.app',
  'http://localhost:3000'
];

// Filter out any undefined or empty URLs
const VALID_URLS = POSSIBLE_API_URLS.filter(url => url);

// Use the first valid URL, or localhost as a last resort
const API_BASE_URL = VALID_URLS[0] || 'http://localhost:3000';

console.log('Using API base URL:', API_BASE_URL);

export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  mode: 'cors'
};

// Helper function to handle API requests with better error handling
export const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      ...API_CONFIG,
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
};

export const API_ENDPOINTS = {
  properties: `${API_BASE_URL}/api/properties`
};