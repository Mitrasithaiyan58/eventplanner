import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // change if your backend runs on a different port
});

export default api;
