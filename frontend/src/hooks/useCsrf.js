import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios instance with credentials and CSRF header wired up
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export function useCsrf() {
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/csrf-token`, { withCredentials: true })
      .then((res) => {
        const token = res.data.csrfToken;
        setCsrfToken(token);
        // Attach token to every subsequent request from this instance
        api.defaults.headers.common['x-csrf-token'] = token;
      })
      .catch((err) => console.error('Failed to fetch CSRF token', err));
  }, []);

  return { csrfToken, api };
}
