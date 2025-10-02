// src/api/httpMethods.js
import api from "./axios";

export const GET = async (url, params = {}) => {
  return api.get(url, { params });
};

export const POST = async (url, data) => {
  return api.post(url, data);
};

export const PUT = async (url, data) => {
  return api.put(url, data);
};

export const DELETE = async (url) => {
  return api.delete(url);
};
