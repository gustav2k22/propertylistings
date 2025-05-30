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
import { API_ENDPOINTS, ALL_API_URLS, testEndpoint } from '../config/api';
import { setPageTitle } from '../utils/titleManager';

function ApiTest() {
  const [apiUrl, setApiUrl] = useState(API_ENDPOINTS.properties);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [apiPaths, setApiPaths] = useState([
    '/api/properties',
    '/properties',
    '/v1/properties'
  ]);
  const [selectedPath, setSelectedPath] = useState('/api/properties');

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
      // Extract the base URL without any paths
      const baseUrl = apiUrl.split('/api')[0].split('/properties')[0].split('/v1')[0];
      const fullUrl = `${baseUrl}${selectedPath}`;
      
      addResult(`Testing connection to: ${fullUrl}`);
      
      const response = await fetch(fullUrl, {
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
      
      // Update the API endpoint in the configuration
      setApiUrl(fullUrl);
      
      return true;
    } catch (error) {
      addResult(`Connection failed: ${error.message}`, false);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to test all possible API paths
  const testAllPaths = async () => {
    setLoading(true);
    addResult('Testing all possible API paths...');
    
    // Extract the base URL from the current API URL
    const baseUrl = apiUrl.split('/api')[0].split('/properties')[0].split('/v1')[0];
    
    let foundWorkingPath = false;
    
    for (const path of apiPaths) {
      try {
        const fullUrl = `${baseUrl}${path}`;
        addResult(`Testing path: ${path} (${fullUrl})`);
        
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors'
        });
        
        if (response.ok) {
          const data = await response.json();
          addResult(`Path ${path} works! Received ${Array.isArray(data) ? data.length : 1} items.`);
          setSelectedPath(path);
          setApiUrl(fullUrl);
          foundWorkingPath = true;
          break;
        } else {
          addResult(`Path ${path} returned status: ${response.status}`, false);
        }
      } catch (error) {
        addResult(`Error testing path ${path}: ${error.message}`, false);
      }
    }
    
    if (!foundWorkingPath) {
      addResult('Could not find a working API path. Try adding a custom path.', false);
    }
    
    setLoading(false);
    return foundWorkingPath;
  };

  const testHealthEndpoint = async () => {
    setLoading(true);
    try {
      const healthUrl = API_ENDPOINTS.health;
      
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
  
  const testDatabaseConnection = async () => {
    setLoading(true);
    try {
      const dbStatusUrl = API_ENDPOINTS.dbStatus;
      
      addResult(`Testing database connection: ${dbStatusUrl}`);
      
      const response = await fetch(dbStatusUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        addResult(`Database connection successful! Response: ${JSON.stringify(data)}`);
        return true;
      } else {
        addResult(`Database connection failed: ${data.error}`, false);
        addResult(`Database config: ${JSON.stringify(data.config)}`, false);
        return false;
      }
    } catch (error) {
      addResult(`Database check failed: ${error.message}`, false);
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
        
        <Box className="mb-6">
          <Typography variant="subtitle1" className="mb-2 font-semibold">
            API Path:
          </Typography>
          <Box className="flex flex-wrap gap-2 mb-4">
            {apiPaths.map((path) => (
              <Button 
                key={path}
                variant={selectedPath === path ? "contained" : "outlined"}
                size="small"
                onClick={() => setSelectedPath(path)}
                className={selectedPath === path ? "bg-blue-600" : ""}
              >
                {path}
              </Button>
            ))}
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => {
                const newPath = prompt('Enter a custom API path (e.g., /api/v2/properties):');
                if (newPath && !apiPaths.includes(newPath)) {
                  setApiPaths([...apiPaths, newPath]);
                  setSelectedPath(newPath);
                }
              }}
            >
              + Add Path
            </Button>
          </Box>
          
          <Box className="flex flex-wrap gap-4 mb-6">
            <Button 
              variant="contained" 
              color="primary" 
              onClick={testApiConnection}
              disabled={loading}
              className="min-w-[180px]"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Test Selected Path'}
            </Button>
            
            <Button 
              variant="contained"
              color="secondary"
              onClick={testAllPaths}
              disabled={loading}
              className="min-w-[180px]"
            >
              Test All Paths
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={testHealthEndpoint}
              disabled={loading}
            >
              Test Health Endpoint
            </Button>
            
            <Button 
              variant="outlined" 
              color="warning"
              onClick={testDatabaseConnection}
              disabled={loading}
            >
              Test Database Connection
            </Button>
          </Box>
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
