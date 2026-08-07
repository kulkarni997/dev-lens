import axios from 'axios';

// Set VITE_API_URL in frontend/.env once you're not just hitting localhost.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Every request picks up the JWT from localStorage automatically.
// This is the same key the future /auth/callback page should write to
// once it's built — see NOTES.md.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('devlens_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;