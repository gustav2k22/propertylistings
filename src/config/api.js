const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  mode: 'cors'
};

export const API_ENDPOINTS = {
  properties: `${API_BASE_URL}/api/properties`
};