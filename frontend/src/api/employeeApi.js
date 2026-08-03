import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (username, password) =>
  axios.post("/api/auth/login", { username, password });

export const registerAdmin = (username, password) =>
  axios.post("/api/auth/register", { username, password });

export const getEmployees = () => API.get("/employees");
export const requestEmployee = (data) => axios.post("/api/employees/request", data);
export const createEmployee = (data) => API.post("/employees", data);
export const updateEmployee = (id, data) => API.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);
export const approveEmployee = (id) => API.patch(`/employees/${id}/approve`);

export const getPendingEmployees = () => API.get("/admin/pending-employees");
export const getPendingUsers = () => API.get("/admin/pending-users");
export const approveUser = (id) => API.post(`/admin/users/${id}/approve`);
export const rejectUser = (id) => API.delete(`/admin/users/${id}/reject`);
