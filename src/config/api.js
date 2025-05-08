// Get all possible API URLs from environment variables with fallbacks
const POSSIBLE_API_URLS = [
  import.meta.env.VITE_API_URL,
  import.meta.env.VITE_API_URL_FALLBACK_1,
  import.meta.env.VITE_API_URL_FALLBACK_2,
  import.meta.env.VITE_API_URL_FALLBACK_3,
  // Your specific Railway URL
  'https://web-production-a3241.up.railway.app',
  'https://web-production-a3241.railway.app',
  // Legacy URLs
  'https://property-listings-production.up.railway.app',
  'https://property-listings-production.railway.app',
  'https://property-listings.railway.app',
  'https://property-listings.up.railway.app',
  'http://localhost:3000'
];

// Clean up URLs to ensure they don't have trailing slashes
const cleanUrls = POSSIBLE_API_URLS.map(url => {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
});

// Filter out any undefined or empty URLs and remove duplicates
const VALID_URLS = [...new Set(cleanUrls.filter(url => url))];

// Use the first valid URL, or localhost as a last resort
const API_BASE_URL = VALID_URLS[0] || 'http://localhost:3000';

console.log('API configuration loaded');
console.log('Primary API URL:', API_BASE_URL);
console.log('Fallback URLs available:', VALID_URLS.length - 1);

// Export the list of all URLs for the diagnostic tool
export const ALL_API_URLS = VALID_URLS;

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

// Define API endpoints with different possible path structures
const API_PATH_OPTIONS = [
  '/api/properties',  // Standard path
  '/properties',      // Simplified path
  '/v1/properties',   // Versioned path
];

// Function to test if an endpoint is valid
export const testEndpoint = async (baseUrl, path) => {
  try {
    const response = await fetch(`${baseUrl}${path}`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Export the endpoints
export const API_ENDPOINTS = {
  properties: `${API_BASE_URL}/properties`, // Use the fallback endpoint by default
  propertiesApi: `${API_BASE_URL}/api/properties`,
  propertiesV1: `${API_BASE_URL}/v1/properties`,
  health: `${API_BASE_URL}/health`,
  dbStatus: `${API_BASE_URL}/db-status`
};