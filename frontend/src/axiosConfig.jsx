import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://54.253.48.157:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
