import axios from 'axios';

// Resolve API base URL: supports both VITE_API_BASE_URL or relative '/api'
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) return '/api';
  const clean = envUrl.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nlc_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const createBooking = async (data) => {
  const res = await api.post('/bookings', data);
  return res.data;
};

export const getBookingById = async (id) => {
  const res = await api.get(`/bookings/${id}`);
  return res.data;
};

// ─── Reports ─────────────────────────────────────────────────────────────────
export const getPatientReports = async (params) => {
  const res = await api.get('/reports', { params });
  return res.data;
};

// ─── Tests & Packages ─────────────────────────────────────────────────────────
export const getTestCatalog = async (category) => {
  const res = await api.get('/tests', { params: category ? { category } : {} });
  return res.data?.data || res.data || [];
};

export const getHealthPackages = async () => {
  const res = await api.get('/tests/packages');
  return res.data?.data || res.data || [];
};

export const syncTestsFromLIS = async () => {
  const res = await api.post('/tests/sync');
  return res.data;
};

export const getSyncStatus = async () => {
  const res = await api.get('/tests/sync-status');
  return res.data?.data || res.data;
};

export const createTestItem = async (data) => {
  const res = await api.post('/tests', data);
  return res.data;
};

export const updateTestItem = async (id, data) => {
  const res = await api.put(`/tests/${id}`, data);
  return res.data;
};

export const deleteTestItem = async (id) => {
  const res = await api.delete(`/tests/${id}`);
  return res.data;
};

// ─── Contact ─────────────────────────────────────────────────────────────────
export const submitContact = async (data) => {
  const res = await api.post('/contact', data);
  return res.data;
};

// ─── Doctors ─────────────────────────────────────────────────────────────────
export const getDoctors = async () => {
  const res = await api.get('/doctors');
  return res.data?.data || res.data || [];
};

export const getDoctorById = async (id) => {
  const res = await api.get(`/doctors/${id}`);
  return res.data?.data || res.data;
};

export const createDoctor = async (formData) => {
  const res = await api.post('/doctors', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateDoctor = async (id, formData) => {
  const res = await api.put(`/doctors/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteDoctor = async (id) => {
  const res = await api.delete(`/doctors/${id}`);
  return res.data;
};

// ─── Gallery ─────────────────────────────────────────────────────────────────
export const getGallery = async (category) => {
  const res = await api.get('/gallery', { params: category ? { category } : {} });
  return res.data?.data || res.data || [];
};

export const createGalleryItem = async (formData) => {
  const res = await api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateGalleryItem = async (id, formData) => {
  const res = await api.put(`/gallery/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteGalleryItem = async (id) => {
  const res = await api.delete(`/gallery/${id}`);
  return res.data;
};

// ─── Notices & Announcements ─────────────────────────────────────────────────
export const getActiveNotices = async () => {
  const res = await api.get('/notices');
  return res.data?.data || res.data || [];
};

export const getAllNotices = async () => {
  const res = await api.get('/notices/all');
  return res.data?.data || res.data || [];
};

export const createNotice = async (data) => {
  const res = await api.post('/notices', data);
  return res.data;
};

export const updateNotice = async (id, data) => {
  const res = await api.put(`/notices/${id}`, data);
  return res.data;
};

export const deleteNotice = async (id) => {
  const res = await api.delete(`/notices/${id}`);
  return res.data;
};

// ─── Admin Authentication & Operations ────────────────────────────────────────
export const loginAdmin = async (password) => {
  const res = await api.post('/admin/login', { password });
  return res.data;
};

export const getAdminMe = async () => {
  const res = await api.get('/admin/me');
  return res.data;
};

export const changeAdminPassword = async (currentPassword, newPassword) => {
  const res = await api.post('/admin/change-password', { currentPassword, newPassword });
  return res.data;
};

export const getAdminStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data?.stats || res.data;
};

export const getAdminBookings = async (params) => {
  const res = await api.get('/admin/bookings', { params });
  return res.data?.data || res.data || [];
};

export const updateBookingStatus = async (id, status) => {
  const res = await api.put(`/admin/bookings/${id}/status`, { status });
  return res.data;
};

export default api;
