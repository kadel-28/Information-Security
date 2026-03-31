// API configuration
// Development: use localhost:5000 (Express server runs there)
// Production: use current domain (Express serves both React + API)
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:5000');

export default API_URL;
