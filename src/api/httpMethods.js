// src/api/httpMethods.js
import api from "./axios";

export const POST = async (url, data, config = {}) => {
  return api.post(url, data, config);
};

export const GET = async (url, params = {}, config = {}) => {
  return api.get(url, { params, ...config });
};

export const PUT = async (url, data, config = {}) => {
  return api.put(url, data, config);
};

export const DELETE = async (url, config = {}) => {
  return api.delete(url, config);
};
