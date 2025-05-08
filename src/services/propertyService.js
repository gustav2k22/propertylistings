import { API_ENDPOINTS } from '../config/api';
import { getAllMockProperties, getMockProperty, addMockProperty, deleteMockProperty } from './mockData';

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
    return getAllMockProperties();
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
    // Add to mock data store so it persists between page views
    console.log('Adding property to mock data store');
    return addMockProperty(propertyData);
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
    // Remove from mock data store
    console.log('Removing property from mock data store');
    const deleted = deleteMockProperty(id);
    return { success: deleted };
  }
};
