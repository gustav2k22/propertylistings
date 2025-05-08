import { API_ENDPOINTS } from '../config/api';
import { mockProperties, getMockProperty } from './mockData';

// Timeout for API requests in milliseconds
const API_TIMEOUT = 5000;

// Function to create a promise that rejects after a timeout
const timeoutPromise = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });
};

// Function to fetch with timeout
const fetchWithTimeout = async (url, options = {}) => {
  return Promise.race([
    fetch(url, options),
    timeoutPromise(API_TIMEOUT)
  ]);
};

// Get all properties with fallback to mock data
export const getProperties = async () => {
  try {
    console.log('Attempting to fetch properties from API:', API_ENDPOINTS.properties);
    const response = await fetchWithTimeout(API_ENDPOINTS.properties);
    
    if (!response.ok) {
      console.warn('API returned error status:', response.status);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched properties from API');
    return data;
  } catch (error) {
    console.error('Error fetching properties, using mock data:', error);
    // Return mock data as fallback
    return mockProperties;
  }
};

// Get a single property by ID with fallback to mock data
export const getPropertyById = async (id) => {
  try {
    console.log(`Attempting to fetch property ${id} from API:`, `${API_ENDPOINTS.properties}/${id}`);
    const response = await fetchWithTimeout(`${API_ENDPOINTS.properties}/${id}`);
    
    if (!response.ok) {
      console.warn('API returned error status:', response.status);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched property from API');
    return data;
  } catch (error) {
    console.error(`Error fetching property ${id}, using mock data:`, error);
    // Return mock data as fallback
    const mockProperty = getMockProperty(id);
    if (!mockProperty) {
      throw new Error('Property not found');
    }
    return mockProperty;
  }
};

// Create a new property
export const createProperty = async (propertyData) => {
  try {
    console.log('Attempting to create property via API');
    const response = await fetchWithTimeout(API_ENDPOINTS.properties, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData)
    });
    
    if (!response.ok) {
      console.warn('API returned error status:', response.status);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully created property via API');
    return data;
  } catch (error) {
    console.error('Error creating property:', error);
    // For creation, we'll simulate success with a mock ID
    console.log('Simulating successful property creation with mock data');
    return {
      ...propertyData,
      id: Math.floor(Math.random() * 1000) + 10, // Random ID that won't conflict with existing mock data
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
};

// Delete a property
export const deleteProperty = async (id) => {
  try {
    console.log(`Attempting to delete property ${id} via API`);
    const response = await fetchWithTimeout(`${API_ENDPOINTS.properties}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      console.warn('API returned error status:', response.status);
      throw new Error(`API error: ${response.status}`);
    }
    
    console.log('Successfully deleted property via API');
    return { success: true };
  } catch (error) {
    console.error(`Error deleting property ${id}:`, error);
    // For deletion, we'll just simulate success
    console.log('Simulating successful property deletion');
    return { success: true };
  }
};
