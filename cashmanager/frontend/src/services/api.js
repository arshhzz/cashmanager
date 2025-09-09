// src/services/api.js
import api from "../utils/api";

// Auth API
export const authAPI = {
  signup: (userData) => api.post("/user/signup", userData),
  signin: (credentials) => api.post("/user/signin", credentials),
  getUsers: (searchFilter) =>
    api.get(`/user/bulk?filter=${encodeURIComponent(searchFilter || "")}`),
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user", data),
};

// Account API
export const accountAPI = {
  getBalance: () => api.get("/account/balance"),
  getTransactions: (page = 1, limit = 10) =>
    api.get(`/account/transactions?page=${page}&limit=${limit}`),
};

// Transaction API
export const transactionAPI = {
  sendMoney: (transferData) => api.post("/account/transfer", transferData),
};
