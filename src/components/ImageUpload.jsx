import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

function ImageUpload({ onImageSelect }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageSelect(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageSelect('');
  };

  return (
    <Box className="w-full">
      {!preview ? (
        <Paper
          variant="outlined"
          className="p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => document.getElementById('image-upload').click()}
        >
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <CloudUploadIcon className="text-gray-400 text-5xl mb-2" />
          <Typography variant="body1" className="mb-1 text-gray-600">
            Click to upload an image
          </Typography>
          <Typography variant="body2" color="textSecondary">
            or drag and drop (max 5MB)
          </Typography>
        </Paper>
      ) : (
        <Paper className="relative overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <IconButton
            className="absolute top-2 right-2 bg-white hover:bg-gray-100"
            onClick={handleRemoveImage}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Paper>
      )}
      
      {error && (
        <Typography color="error" variant="body2" className="mt-2">
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default ImageUpload; 