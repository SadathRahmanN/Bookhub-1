// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/", // Replace with your Django base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // if using cookies for auth
});

export default axiosInstance;
