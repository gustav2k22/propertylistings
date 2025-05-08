import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';

function ApiErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Paper className="p-8 max-w-2xl mx-auto my-8">
      <Box className="flex flex-col items-center text-center">
        <ErrorIcon color="error" style={{ fontSize: 64 }} className="mb-4" />
        <Typography variant="h5" className="mb-2 font-bold">
          Connection Error
        </Typography>
        <Typography variant="body1" className="mb-4 text-gray-600">
          We're having trouble connecting to our servers. This could be due to:
        </Typography>
        
        <Box className="text-left mb-6">
          <ul className="list-disc pl-6 text-gray-600">
            <li className="mb-2">A temporary server outage</li>
            <li className="mb-2">Network connectivity issues</li>
            <li className="mb-2">The API endpoint being unavailable</li>
          </ul>
        </Box>
        
        <Typography variant="body2" className="mb-6 text-red-600 bg-red-50 p-4 rounded">
          Error details: {error.message}
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<RefreshIcon />}
          onClick={resetErrorBoundary}
          className="px-6"
        >
          Try Again
        </Button>
      </Box>
    </Paper>
  );
}

export default ApiErrorFallback;
