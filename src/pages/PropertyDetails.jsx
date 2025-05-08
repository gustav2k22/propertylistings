import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  Button,
  Skeleton,
  Box,
  Divider,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UpdateIcon from '@mui/icons-material/Update';
import { setPageTitle } from '../utils/titleManager';
import Toast from '../components/Toast';

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.properties}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Property not found');
      }
      const data = await response.json();
      setProperty(data);
      setPageTitle(data.title);
    } catch (err) {
      setError(err.message);
      setPageTitle('Property Not Found');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.properties}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      setToast({
        open: true,
        message: 'Property deleted successfully',
        severity: 'success'
      });

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setToast({
        open: true,
        message: err.message,
        severity: 'error'
      });
    }
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <Box className="max-w-4xl mx-auto">
        <Skeleton variant="rectangular" height={300} className="mb-4 rounded-lg" />
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" height={60} className="mb-2" />
            <Skeleton variant="text" height={30} className="mb-4" />
            <Skeleton variant="rectangular" height={200} className="rounded-lg" />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={200} className="rounded-lg" />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="max-w-4xl mx-auto">
        <Paper className="p-6">
          <Typography color="error" variant="h6">{error}</Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            className="mt-4"
          >
            Back to Listings
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          className="hover:bg-gray-100"
        >
          Back to Listings
        </Button>
        <Button
          startIcon={<DeleteIcon />}
          color="error"
          variant="outlined"
          onClick={() => setDeleteDialogOpen(true)}
          className="hover:bg-red-50"
        >
          Delete Property
        </Button>
      </div>

      <Paper className="overflow-hidden rounded-xl shadow-md">
        <Box className="relative aspect-[16/9] overflow-hidden">
          <img
            src={property.image_url || 'https://via.placeholder.com/1200x600'}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <Box className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <Box className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <Typography variant="h4" component="h1" className="font-bold mb-2">
              {property.title}
            </Typography>
            <div className="flex items-center">
              <LocationOnIcon className="mr-2" />
              <Typography variant="h6">
                {property.location}
              </Typography>
            </div>
          </Box>
        </Box>

        <Box className="p-6">
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box className="mb-6">
                <Typography variant="h4" color="primary" className="font-bold mb-4">
                  GH₵{property.price.toLocaleString()}
                </Typography>
                <Divider className="mb-4" />
                <Typography variant="h6" className="font-semibold text-gray-800 mb-3">
                  Property Description
                </Typography>
                <Typography variant="body1" className="text-gray-600 whitespace-pre-line">
                  {property.description || 'No description available.'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={0} className="p-4 bg-gray-50 rounded-xl">
                <Typography variant="h6" className="font-semibold mb-4">
                  Property Details
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" className="mb-1">
                      Listed Date
                    </Typography>
                    <div className="flex items-center">
                      <CalendarTodayIcon className="mr-2 text-gray-400" fontSize="small" />
                      <Typography variant="body2" className="font-medium">
                        {new Date(property.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </div>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" className="mb-1">
                      Last Updated
                    </Typography>
                    <div className="flex items-center">
                      <UpdateIcon className="mr-2 text-gray-400" fontSize="small" />
                      <Typography variant="body2" className="font-medium">
                        {new Date(property.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </div>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" className="mb-1">
                      Property ID
                    </Typography>
                    <Chip 
                      label={`#${property.id}`}
                      variant="outlined"
                      size="small"
                      className="font-medium"
                    />
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="font-bold">
          Delete Property
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this property? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}

export default PropertyDetails; 