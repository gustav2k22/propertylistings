import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './utils/theme';
import Layout from './components/Layout';
import PropertyListings from './pages/PropertyListings';
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/AddProperty';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<PropertyListings />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/add-property" element={<AddProperty />} />
            </Routes>
          </ErrorBoundary>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
