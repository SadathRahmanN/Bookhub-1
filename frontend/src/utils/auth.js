// src/utils/auth.js

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const ROLE_KEY = 'user_role';
const USER_KEY = 'username';

export function setAuth({ access, refresh, role, username }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(USER_KEY, username);
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getUserRole() {
  return localStorage.getItem(ROLE_KEY);
}

export function getUsername() {
  return localStorage.getItem(USER_KEY);
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}
