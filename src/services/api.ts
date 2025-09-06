// API Base Configuration
const API_BASE_URL = 'http://localhost:4000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  logout: async () => {
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (project: { name: string; description: string }) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });
    return handleResponse(response);
  },

  update: async (id: string, project: Partial<{ name: string; description: string }>) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getByProject: async (projectId: string) => {
    const response = await fetch(`${API_BASE_URL}/tasks?projectId=${projectId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getMyTasks: async (options?: { limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (options?.limit) {
      queryParams.append('limit', options.limit.toString());
    }
    
    const response = await fetch(`${API_BASE_URL}/tasks/my-tasks?${queryParams.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (task: {
    title: string;
    description: string;
    projectId: string;
    assignedTo?: string;
    dueDate?: string;
    priority?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(task),
    });
    return handleResponse(response);
  },

  update: async (id: string, task: Partial<{
    title: string;
    description: string;
    status: string;
    assignedTo: string;
    dueDate: string;
    priority: string;
  }>) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(task),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Analytics API
export const analyticsAPI = {
  getPlatformStats: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/platform`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getProjectStats: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/projects`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getUserStats: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/users`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Attachments API
export const attachmentsAPI = {
  upload: async (file: File, projectId?: string, taskId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) formData.append('projectId', projectId);
    if (taskId) formData.append('taskId', taskId);

    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/attachments/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return handleResponse(response);
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/attachments`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Invitations API
export const invitationsAPI = {
  sendInvitation: async (projectId: string, email: string, role: string = 'member') => {
    const response = await fetch(`${API_BASE_URL}/invitations/${projectId}/invite`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, role }),
    });
    return handleResponse(response);
  },

  getInvitations: async () => {
    const response = await fetch(`${API_BASE_URL}/invitations`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
