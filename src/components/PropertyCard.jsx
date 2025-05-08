import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function PropertyCard({ property }) {
  const navigate = useNavigate();

  return (
    <Card 
      className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      <Box className="relative aspect-[16/10] overflow-hidden">
        <CardMedia
          component="img"
          image={property.image_url || 'https://via.placeholder.com/800x500'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <Box className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <Chip
          label={`GH₵${property.price.toLocaleString()}`}
          color="primary"
          className="absolute bottom-2 right-2 font-semibold shadow-md"
        />
      </Box>
      <CardContent className="p-4">
        <Typography 
          variant="h6" 
          component="h2" 
          className="mb-2 font-semibold text-gray-800 line-clamp-2 h-[48px]"
        >
          {property.title}
        </Typography>
        <div className="flex items-center mb-2 text-gray-600">
          <LocationOnIcon className="mr-1 text-sm" />
          <Typography variant="body2" className="line-clamp-1">
            {property.location}
          </Typography>
        </div>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          className="line-clamp-2 h-[40px]"
        >
          {property.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default PropertyCard; 