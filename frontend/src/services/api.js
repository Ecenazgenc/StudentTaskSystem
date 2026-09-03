const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchWithFallback(endpoint, options = {}, fallbackData = null) {
  try {
    const isAuthRoute = endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/register');
    const token = isAuthRoute ? null : (sessionStorage.getItem('stss_jwt_token') || localStorage.getItem('stss_jwt_token'));
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      credentials: 'include',
      ...options,
      headers,
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => null);
      const errMsg = errBody?.message || `HTTP error! status: ${response.status}`;
      const err = new Error(errMsg);
      err.status = response.status;
      err.data = errBody;
      throw err;
    }
    return await response.json();
  } catch (err) {
    if (err.status) {
      throw err;
    }
    console.warn(`Backend connection to ${endpoint} failed, using local state:`, err.message);
    return fallbackData;
  }
}

export const authApi = {
  login: (email, password, fallback) => fetchWithFallback('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, fallback),
  register: (user, fallback) => fetchWithFallback('/auth/register', { method: 'POST', body: JSON.stringify(user) }, fallback),
  forgotPassword: (email, fallback) => fetchWithFallback('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }, fallback),
  resetPassword: (token, newPassword, fallback) => fetchWithFallback('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }, fallback),
};

export const userApi = {
  getAll: (fallback) => fetchWithFallback('/users', {}, fallback),
  register: (user, fallback) => fetchWithFallback('/users', { method: 'POST', body: JSON.stringify(user) }, fallback),
  update: (id, user, fallback) => fetchWithFallback(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }, fallback),
  delete: (id, fallback) => fetchWithFallback(`/users/${id}`, { method: 'DELETE' }, fallback),
};

export const taskApi = {
  getAll: (paramsOrFallback, maybeFallback) => {
    let endpoint = '/tasks';
    let fallback = null;
    if (paramsOrFallback && typeof paramsOrFallback === 'object' && !Array.isArray(paramsOrFallback)) {
      const query = new URLSearchParams();
      if (paramsOrFallback.search) query.set('search', paramsOrFallback.search);
      if (paramsOrFallback.courseId && paramsOrFallback.courseId !== 'all') query.set('courseId', paramsOrFallback.courseId);
      if (paramsOrFallback.categoryId && paramsOrFallback.categoryId !== 'all') query.set('categoryId', paramsOrFallback.categoryId);
      if (paramsOrFallback.status && paramsOrFallback.status !== 'all') query.set('status', paramsOrFallback.status);
      if (paramsOrFallback.priority && paramsOrFallback.priority !== 'all') query.set('priority', paramsOrFallback.priority);
      if (paramsOrFallback.page !== undefined) query.set('page', paramsOrFallback.page);
      if (paramsOrFallback.size !== undefined) query.set('size', paramsOrFallback.size);
      if (paramsOrFallback.unpaged !== undefined) query.set('unpaged', paramsOrFallback.unpaged);
      const qs = query.toString();
      if (qs) endpoint += `?${qs}`;
      fallback = maybeFallback;
    } else {
      fallback = paramsOrFallback;
    }
    return fetchWithFallback(endpoint, {}, fallback);
  },
  create: (task, fallback) => fetchWithFallback('/tasks', { method: 'POST', body: JSON.stringify(task) }, fallback),
  update: (id, task, fallback) => fetchWithFallback(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }, fallback),
  delete: (id, fallback) => fetchWithFallback(`/tasks/${id}`, { method: 'DELETE' }, fallback),
};

export const courseApi = {
  getAll: (fallback) => fetchWithFallback('/courses', {}, fallback),
  create: (course, fallback) => fetchWithFallback('/courses', { method: 'POST', body: JSON.stringify(course) }, fallback),
  update: (id, course, fallback) => fetchWithFallback(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(course) }, fallback),
  delete: (id, fallback) => fetchWithFallback(`/courses/${id}`, { method: 'DELETE' }, fallback),
};

export const categoryApi = {
  getAll: (fallback) => fetchWithFallback('/categories', {}, fallback),
};

export const commentApi = {
  create: (comment, fallback) => fetchWithFallback('/comments', { method: 'POST', body: JSON.stringify(comment) }, fallback),
};

export const attachmentApi = {
  getAll: (fallback) => fetchWithFallback('/attachments', {}, fallback),
  create: (attachment, fallback) => fetchWithFallback('/attachments', { method: 'POST', body: JSON.stringify(attachment) }, fallback),
  delete: (id, fallback) => fetchWithFallback(`/attachments/${id}`, { method: 'DELETE' }, fallback),
};

export const notificationApi = {
  getAll: (fallback) => fetchWithFallback('/notifications', {}, fallback),
  create: (notification, fallback) => fetchWithFallback('/notifications', { method: 'POST', body: JSON.stringify(notification) }, fallback),
  markRead: (id, fallback) => fetchWithFallback(`/notifications/${id}/read`, { method: 'PUT' }, fallback),
  markAllRead: (userId, fallback) => fetchWithFallback(`/notifications/read-all/${userId}`, { method: 'PUT' }, fallback),
};

export const noteApi = {
  getAll: (fallback) => fetchWithFallback('/notes', {}, fallback),
  getByUser: (userId, fallback) => fetchWithFallback(`/notes/user/${userId}`, {}, fallback),
  create: (note, fallback) => fetchWithFallback('/notes', { method: 'POST', body: JSON.stringify(note) }, fallback),
  update: (id, note, fallback) => fetchWithFallback(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(note) }, fallback),
  delete: (id, fallback) => fetchWithFallback(`/notes/${id}`, { method: 'DELETE' }, fallback),
  togglePin: (id, fallback) => fetchWithFallback(`/notes/${id}/pin`, { method: 'PATCH' }, fallback),
};
