import axios from 'axios';
const BASE_URL = 'http://localhost:3050';

export default axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
});
