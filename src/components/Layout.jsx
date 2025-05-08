import { Box, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box className="min-h-screen flex flex-col">
      <AppBar position="fixed" elevation={1} className="bg-white">
        <Container maxWidth="lg">
          <Toolbar className="px-0">
            <Button
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              className="mr-4 text-primary hover:bg-gray-100"
            >
              <Typography variant="h6" component="span" className="font-bold text-gray-800">
                Property Listings
              </Typography>
            </Button>
            <Box className="flex-grow" />
            {location.pathname === '/' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/add-property')}
                className="hover:shadow-md"
              >
                Add Property
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar /> {/* Spacer for fixed AppBar */}
      <Box className="flex-grow bg-gray-50 py-8">
        <Container maxWidth="lg" className="h-full">
          {children}
        </Container>
      </Box>
      <Box component="footer" className="bg-white border-t border-gray-200 py-6">
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Property Listings. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Layout; 