import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Checks whether the main Hospital / LIS server endpoint is configured.
 * When empty or unset, our middleware automatically serves dummy fallback data.
 */
export const isLisConfigured = () => {
  const url = process.env.LIS_BASE_URL?.trim();
  return Boolean(url && url.length > 0 && !url.includes('api.mainhospital.com'));
};

// LIS Axios instance — all calls to the main hospital LIS server go through here
const lisClient = axios.create({
  baseURL: process.env.LIS_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.LIS_API_KEY || '',
  },
});

// Update baseURL on every request in case ENV changes dynamically
lisClient.interceptors.request.use((config) => {
  if (process.env.LIS_BASE_URL) {
    config.baseURL = process.env.LIS_BASE_URL;
  }
  if (process.env.LIS_API_KEY) {
    config.headers['x-api-key'] = process.env.LIS_API_KEY;
  }
  if (process.env.NODE_ENV === 'development') {
    console.log(`[LIS Gateway →] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  }
  return config;
});

export default lisClient;
