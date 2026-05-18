import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001', // local
  baseURL: 'http://BookManager-1596291518.ap-southeast-2.elb.amazonaws.com', // live ALB
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
