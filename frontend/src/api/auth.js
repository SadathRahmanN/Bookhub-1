// src/api/auth.js
import axiosInstance from "./axiosInstance";

export const login = async (credentials) => {
  const res = await axiosInstance.post("auth/login/", credentials);
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("auth/logout/");
  return res.data;
};

export const register = async (userData) => {
  const res = await axiosInstance.post("auth/register/", userData);
  return res.data;
};
