import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { setPageTitle } from '../utils/titleManager';
import ImageUpload from '../components/ImageUpload';
import Toast from '../components/Toast';

function AddProperty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    image_url: ''
  });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setPageTitle('Add Property');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (imageData) => {
    setFormData(prev => ({
      ...prev,
      image_url: imageData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.price || !formData.location) {
      setToast({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    // Price validation
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setToast({
        open: true,
        message: 'Please enter a valid price',
        severity: 'error'
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: price
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create property');
      }

      const data = await response.json();
      setToast({
        open: true,
        message: 'Property created successfully!',
        severity: 'success'
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        location: '',
        image_url: ''
      });

      // Redirect to the new property after 2 seconds
      setTimeout(() => {
        navigate(`/property/${data.id}`);
      }, 2000);

    } catch (err) {
      setToast({
        open: true,
        message: err.message,
        severity: 'error'
      });
    }
  };

  return (
    <Box className="max-w-4xl mx-auto">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        className="mb-6 hover:bg-gray-100"
      >
        Back to Listings
      </Button>

      <Paper className="p-6 rounded-xl shadow-md">
        <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-6">
          Add New Property
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                variant="outlined"
                className="bg-white"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
                className="bg-white"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                variant="outlined"
                className="bg-white"
                InputProps={{
                  startAdornment: <span className="text-gray-500 mr-1">GH₵</span>
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                variant="outlined"
                className="bg-white"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" className="mb-2 font-medium text-gray-700">
                Property Image
              </Typography>
              <ImageUpload onImageSelect={handleImageSelect} />
            </Grid>

            <Grid item xs={12}>
              <Divider className="my-4" />
              <Box className="flex justify-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  className="min-w-[200px] hover:shadow-lg transition-shadow"
                >
                  Add Property
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}

export default AddProperty; 