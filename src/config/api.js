// Try to get the API URL from environment variables, with fallbacks
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://property-listings-production.railway.app' || 'http://localhost:3000';

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