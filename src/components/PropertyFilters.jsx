import { useState } from 'react';
import {
  Paper,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  Collapse,
  Button,
  Typography,
  Box,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';

function PropertyFilters({ onFilterChange }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      search: '',
      minPrice: '',
      maxPrice: '',
      location: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
    setShowFilters(false);
  };

  return (
    <Paper className="overflow-hidden rounded-xl shadow-sm">
      <Box className="p-4">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search by title, description, or location..."
              variant="outlined"
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-gray-400" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<TuneIcon />}
              variant="outlined"
              color="primary"
              className="h-[56px] min-w-[120px]"
            >
              Filters
              {Object.values(filters).some(value => value) && (
                <Box className="ml-2 w-5 h-5 rounded-full bg-primary-light flex items-center justify-center text-xs text-white">
                  {Object.values(filters).filter(value => value).length}
                </Box>
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Collapse in={showFilters}>
        <Divider />
        <Box className="p-4 bg-gray-50">
          <Typography variant="subtitle2" className="mb-3 font-medium text-gray-700">
            Filter Properties
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="minPrice"
                label="Min Price"
                type="number"
                value={filters.minPrice}
                onChange={handleChange}
                variant="outlined"
                size="medium"
                InputProps={{
                  startAdornment: <InputAdornment position="start">GH₵</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="maxPrice"
                label="Max Price"
                type="number"
                value={filters.maxPrice}
                onChange={handleChange}
                variant="outlined"
                size="medium"
                InputProps={{
                  startAdornment: <InputAdornment position="start">GH₵</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="location"
                label="Location"
                value={filters.location}
                onChange={handleChange}
                variant="outlined"
                size="medium"
              />
            </Grid>
          </Grid>
          <Box className="flex justify-end mt-4">
            <Button
              onClick={handleClear}
              color="inherit"
              className="mr-2"
            >
              Clear All
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
}

export default PropertyFilters; 