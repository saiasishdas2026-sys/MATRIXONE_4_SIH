/**
 * Sovereign API Client for MATRIXONE FastAPI Backend
 * Handles automatic JWT Bearer token injection, full HTTP methods,
 * centralized error normalization, and 401 session expiration handling.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('matrixone_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res, endpoint) => {
  if (res.status === 401) {
    // Session expired or unauthorized
    console.warn(`[MATRIXONE API] 401 Unauthorized for ${endpoint}`);
    // Only trigger session clear if we are not attempting a login
    if (!endpoint.includes('/auth/login')) {
      localStorage.removeItem('matrixone_token');
      localStorage.removeItem('matrixone_user');
      window.dispatchEvent(new CustomEvent('matrixone_auth_expired'));
    }
  }

  if (!res.ok) {
    let errorDetail = `HTTP ${res.status}`;
    try {
      const errData = await res.json();
      errorDetail = errData.detail || errData.message || JSON.stringify(errData);
    } catch {
      errorDetail = res.statusText || errorDetail;
    }
    const err = new Error(errorDetail);
    err.status = res.status;
    throw err;
  }

  return await res.json();
};

export const apiClient = {
  async get(endpoint, params = null) {
    let url = `${API_BASE}${endpoint}`;
    if (params) {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
      ).toString();
      if (qs) url += `?${qs}`;
    }
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(res, endpoint);
  },

  async post(endpoint, data = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(res, endpoint);
  },

  async put(endpoint, data = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(res, endpoint);
  },

  async patch(endpoint, data = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(res, endpoint);
  },

  async delete(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(res, endpoint);
  },

  /**
   * Multipart / Form-Data upload for CSV/XLSX
   */
  async upload(endpoint, formData) {
    const token = localStorage.getItem('matrixone_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return await handleResponse(res, endpoint);
  }
};
