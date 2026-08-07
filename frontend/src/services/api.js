const API_BASE = '/api';

export async function fetchWithFallback(endpoint, options = {}, fallbackData = null) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn(`Backend connection to ${endpoint} failed, using local state:`, err.message);
    return fallbackData;
  }
}

export const userApi = {
  getAll: (fallback) => fetchWithFallback('/users', {}, fallback),
  register: (user, fallback) => fetchWithFallback('/users', { method: 'POST', body: JSON.stringify(user) }, fallback),
  update: (id, user, fallback) => fetchWithFallback(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }, fallback),
  delete: (id, fallback) => fetchWithFallback(`/users/${id}`, { method: 'DELETE' }, fallback),
};

export const taskApi = {
  getAll: (fallback) => fetchWithFallback('/tasks', {}, fallback),
  create: (task, fallback) => fetchWithFallback('/tasks', { method: 'POST', body: JSON.stringify(task) }, fallback),
  update: (id, task, fallback) => fetchWithFallback(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }, fallback),
  delete: (id, fallback) => fetchWithFallback(`/tasks/${id}`, { method: 'DELETE' }, fallback),
};

export const courseApi = {
  getAll: (fallback) => fetchWithFallback('/courses', {}, fallback),
  create: (course, fallback) => fetchWithFallback('/courses', { method: 'POST', body: JSON.stringify(course) }, fallback),
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
  markRead: (id, fallback) => fetchWithFallback(`/notifications/${id}/read`, { method: 'PUT' }, fallback),
};
