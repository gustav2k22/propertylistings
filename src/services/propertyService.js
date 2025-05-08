import { API_ENDPOINTS } from '../config/api';
import { getAllMockProperties, getMockProperty, addMockProperty, deleteMockProperty } from './mockData';

// Timeout for API requests in milliseconds
const API_TIMEOUT = 10000; // Increased timeout to give API more time to respond

// Flag to track if we're using mock data
let usingMockData = false;

// Store the last time we successfully connected to the API
let lastSuccessfulApiConnection = 0;

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

// Store the working API path once found
let workingApiPath = '/api/properties';

// Function to try different API paths
const tryApiPaths = async (baseUrl) => {
  const paths = [
    '/api/properties',
    '/properties',
    '/v1/properties'
  ];
  
  for (const path of paths) {
    try {
      const response = await fetchWithTimeout(`${baseUrl}${path}`);
      if (response.ok) {
        workingApiPath = path;
        console.log(`Found working API path: ${path}`);
        return { success: true, data: await response.json() };
      }
    } catch (error) {
      console.error(`Error trying path ${path}:`, error);
    }
  }
  
  return { success: false };
};

// Get all properties with fallback to mock data
export const getProperties = async (forceRefresh = false) => {
  // Determine if we should try the API
  // We'll try if:
  // 1. forceRefresh is true (user explicitly requested refresh)
  // 2. We're not currently using mock data
  // 3. It's been more than a minute since our last successful API connection
  const shouldTryApi = forceRefresh || !usingMockData || (Date.now() - lastSuccessfulApiConnection > 60000);
  
  if (shouldTryApi) {
    try {
      // Extract the base URL
      const baseUrl = API_BASE_URL.split('/api')[0].split('/properties')[0].split('/v1')[0];
      console.log('Base URL for API:', baseUrl);
      
      // First try the known working path
      console.log(`Attempting to fetch properties using path: ${workingApiPath}`);
      const response = await fetchWithTimeout(`${baseUrl}${workingApiPath}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Successfully fetched properties from API');
        
        // Update our connection status
        usingMockData = false;
        lastSuccessfulApiConnection = Date.now();
        
        return data;
      } else {
        console.warn('API returned error status:', response.status);
        
        // If the known path doesn't work, try all paths
        console.log('Trying all possible API paths...');
        const result = await tryApiPaths(baseUrl);
        
        if (result.success) {
          // Update our connection status
          usingMockData = false;
          lastSuccessfulApiConnection = Date.now();
          
          return result.data;
        } else {
          throw new Error('No working API path found');
        }
      }
    } catch (error) {
      console.error('Error fetching properties from API:', error);
      usingMockData = true;
    }
  }
  
  // If we're here, either we're using mock data or the API request failed
  console.log('Using mock data for properties');
  return getAllMockProperties();
};

// Get a single property by ID with fallback to mock data
export const getPropertyById = async (id, forceRefresh = false) => {
  // Determine if we should try the API
  const shouldTryApi = forceRefresh || !usingMockData || (Date.now() - lastSuccessfulApiConnection > 60000);
  
  if (shouldTryApi) {
    try {
      // Extract the base URL
      const baseUrl = API_BASE_URL.split('/api')[0].split('/properties')[0].split('/v1')[0];
      
      // Use the known working path
      const fullUrl = `${baseUrl}${workingApiPath}/${id}`;
      console.log(`Attempting to fetch property ${id} from API:`, fullUrl);
      
      const response = await fetchWithTimeout(fullUrl);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Successfully fetched property from API');
        
        // Update our connection status
        usingMockData = false;
        lastSuccessfulApiConnection = Date.now();
        
        return data;
      } else {
        console.warn('API returned error status:', response.status);
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error fetching property ${id} from API:`, error);
      usingMockData = true;
    }
  }
  
  // If we're here, either we're using mock data or the API request failed
  console.log(`Using mock data for property ${id}`);
  const mockProperty = getMockProperty(id);
  if (!mockProperty) {
    throw new Error('Property not found');
  }
  return mockProperty;
};

// Create a new property
export const createProperty = async (propertyData) => {
  // Always try to create in the API first
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
    
    // Update our connection status
    usingMockData = false;
    lastSuccessfulApiConnection = Date.now();
    
    return data;
  } catch (error) {
    console.error('Error creating property via API:', error);
    usingMockData = true;
    
    // Add to mock data store as fallback
    console.log('Adding property to mock data store');
    const newProperty = addMockProperty(propertyData);
    
    // In a real app, we might queue this for later sync to the API
    // when connectivity is restored
    
    return newProperty;
  }
};

// Delete a property
export const deleteProperty = async (id) => {
  // Always try to delete from the API first
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
    
    // Update our connection status
    usingMockData = false;
    lastSuccessfulApiConnection = Date.now();
    
    // Also remove from mock data if it exists there
    deleteMockProperty(id);
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting property ${id} via API:`, error);
    usingMockData = true;
    
    // Remove from mock data store as fallback
    console.log('Removing property from mock data store');
    const deleted = deleteMockProperty(id);
    
    // In a real app, we might queue this for later sync to the API
    // when connectivity is restored
    
    return { success: deleted };
  }
};
