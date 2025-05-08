import { useState, useEffect, useMemo } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import PropertyCard from '../components/PropertyCard';
import PropertyCardSkeleton from '../components/PropertyCardSkeleton';
import PropertyFilters from '../components/PropertyFilters';
import { setPageTitle } from '../utils/titleManager';
import { API_ENDPOINTS, fetchAPI } from '../config/api';

function PropertyListings() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  });

  useEffect(() => {
    setPageTitle('Home');
    fetchProperties();

    // Check API connectivity
    const checkApiConnectivity = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.properties}?limit=1`, {
          method: 'HEAD',
          cache: 'no-store'
        });
        if (!response.ok) {
          console.warn('API connectivity check failed:', response.status);
        } else {
          console.log('API connectivity check passed');
        }
      } catch (err) {
        console.error('API connectivity check error:', err);
        setError('Unable to connect to the API. Please check your network connection.');
      }
    };
    
    checkApiConnectivity();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await fetchAPI(API_ENDPOINTS.properties);
      setProperties(data);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = !filters.search || 
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.search.toLowerCase());

      const matchesMinPrice = !filters.minPrice || property.price >= parseFloat(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || property.price <= parseFloat(filters.maxPrice);
      const matchesLocation = !filters.location || 
        property.location.toLowerCase().includes(filters.location.toLowerCase());

      return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesLocation;
    });
  }, [properties, filters]);

  return (
    <Box>
      <Box className="mb-8">
        <Typography variant="h4" component="h1" className="mb-6 font-bold text-gray-800">
          Find Your Dream Property
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" className="mb-6">
          Browse through our collection of premium properties and find your perfect home.
        </Typography>
        <PropertyFilters onFilterChange={setFilters} />
      </Box>

      {error && (
        <Typography color="error" className="mb-6 p-4 bg-red-50 rounded-lg">
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {loading
          ? Array.from(new Array(8)).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <PropertyCardSkeleton />
              </Grid>
            ))
          : filteredProperties.map((property) => (
              <Grid item key={property.id} xs={12} sm={6} md={4} lg={3}>
                <PropertyCard property={property} />
              </Grid>
            ))}
      </Grid>

      {!loading && filteredProperties.length === 0 && !error && (
        <Box className="text-center py-12 px-4 bg-gray-50 rounded-lg mt-6">
          <Typography variant="h6" color="text.secondary" className="mb-2">
            {properties.length === 0
              ? "No properties found. Add a new property to get started!"
              : "No properties match your search criteria."}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search terms.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default PropertyListings; 