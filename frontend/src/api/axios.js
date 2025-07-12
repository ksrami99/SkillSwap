import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api-skillswap.onrender.com/api/v1', // ✅ your backend base URL
  withCredentials: true, // ✅ send cookies with every request
});

export default instance;
