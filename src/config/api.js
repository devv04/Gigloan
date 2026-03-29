// Central API configuration
// In development, defaults to localhost. In production, uses the deployed backend URL.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE_URL;
