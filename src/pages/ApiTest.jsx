import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import { API_ENDPOINTS, ALL_API_URLS } from '../config/api';
import { setPageTitle } from '../utils/titleManager';

function ApiTest() {
  const [apiUrl, setApiUrl] = useState(API_ENDPOINTS.properties);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    setPageTitle('API Connection Test');
  }, []);

  const addResult = (message, success = true) => {
    const timestamp = new Date().toISOString().substring(11, 19);
    setTestResults(prev => [
      { 
        id: Date.now(), 
        message, 
        success, 
        timestamp 
      },
      ...prev
    ]);
  };

  const testApiConnection = async () => {
    setLoading(true);
    try {
      addResult(`Testing connection to: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      addResult(`Connection successful! Received ${Array.isArray(data) ? data.length : 1} items.`);
      
      // Display the data
      addResult(`Data preview: ${JSON.stringify(data).substring(0, 100)}...`);
      
      return true;
    } catch (error) {
      addResult(`Connection failed: ${error.message}`, false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const testHealthEndpoint = async () => {
    setLoading(true);
    try {
      const baseUrl = apiUrl.split('/api')[0];
      const healthUrl = `${baseUrl}/health`;
      
      addResult(`Testing health endpoint: ${healthUrl}`);
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Health check returned status: ${response.status}`);
      }
      
      const data = await response.json();
      addResult(`Health check successful! Response: ${JSON.stringify(data)}`);
      
      return true;
    } catch (error) {
      addResult(`Health check failed: ${error.message}`, false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const useCustomUrl = () => {
    if (customUrl.trim()) {
      setApiUrl(customUrl.trim());
      addResult(`Changed API URL to: ${customUrl.trim()}`);
    }
  };

  return (
    <Box className="max-w-4xl mx-auto py-6">
      <Paper className="p-6 mb-6">
        <Typography variant="h4" className="mb-4 font-bold">
          API Connection Diagnostics
        </Typography>
        
        <Typography variant="body1" className="mb-4">
          This tool helps diagnose connection issues between your Vercel frontend and Railway backend.
        </Typography>
        
        <Box className="mb-6">
          <Typography variant="subtitle1" className="mb-2 font-semibold">
            Current API Endpoint:
          </Typography>
          <Typography variant="body2" className="p-2 bg-gray-100 rounded font-mono">
            {apiUrl}
          </Typography>
        </Box>
        
        <Box className="mb-6">
          <Typography variant="subtitle1" className="mb-2 font-semibold">
            Available API URLs:
          </Typography>
          <Paper variant="outlined" className="p-2 max-h-40 overflow-y-auto">
            {ALL_API_URLS.map((url, index) => (
              <Box 
                key={index} 
                className={`p-2 mb-1 rounded cursor-pointer hover:bg-gray-100 ${url === apiUrl ? 'bg-blue-50 border border-blue-200' : ''}`}
                onClick={() => {
                  setApiUrl(url);
                  addResult(`Changed API URL to: ${url}`);
                }}
              >
                <Typography variant="body2" className="font-mono">
                  {url}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Box>
        
        <Box className="flex gap-4 mb-6">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={testApiConnection}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Test API Connection'}
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={testHealthEndpoint}
            disabled={loading}
          >
            Test Health Endpoint
          </Button>
        </Box>
        
        <Box className="mb-6">
          <Typography variant="subtitle1" className="mb-2 font-semibold">
            Try Custom API URL:
          </Typography>
          <Box className="flex gap-2">
            <TextField 
              fullWidth
              variant="outlined"
              placeholder="Enter a custom API URL to test"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              size="small"
            />
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={useCustomUrl}
              disabled={!customUrl.trim()}
            >
              Use This URL
            </Button>
          </Box>
        </Box>
      </Paper>
      
      <Paper className="p-6">
        <Typography variant="h5" className="mb-4 font-semibold">
          Test Results
        </Typography>
        
        {testResults.length === 0 ? (
          <Typography variant="body2" color="text.secondary" className="italic">
            No tests run yet. Click one of the test buttons above to begin.
          </Typography>
        ) : (
          <List>
            {testResults.map((result, index) => (
              <Box key={result.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box className="flex items-center">
                        <Box 
                          className={`w-3 h-3 rounded-full mr-2 ${result.success ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        <Typography 
                          variant="body2" 
                          className="font-mono text-gray-500"
                        >
                          [{result.timestamp}]
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography 
                        variant="body1" 
                        className={`mt-1 ${result.success ? 'text-gray-800' : 'text-red-600'}`}
                      >
                        {result.message}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < testResults.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}

export default ApiTest;
