import { d as derived, w as writable } from './index-o6C5pnWt.js';

const API_BASE = "http://127.0.0.1:8000";
function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    token: null,
    isAuthenticated: false
  });
  return {
    subscribe,
    login: async (email, password) => {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      const data = await response.json();
      update((state) => ({
        ...state,
        token: data.access_token,
        isAuthenticated: true
      }));
      const userResponse = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          "Authorization": `Bearer ${data.access_token}`
        }
      });
      const user = await userResponse.json();
      update((state) => ({ ...state, user }));
      return user;
    },
    logout: () => {
      set({ user: null, token: null, isAuthenticated: false });
    },
    checkAuth: async () => {
      return false;
    }
  };
}
const auth = createAuthStore();
function createTasksStore() {
  const { subscribe, set, update } = writable([]);
  let token = null;
  auth.subscribe((state) => {
    token = state.token;
  });
  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  });
  return {
    subscribe,
    load: async (filters = {}) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await fetch(`${API_BASE}/api/tasks/?${params}`, {
        headers: getHeaders()
      });
      const tasks2 = await response.json();
      set(tasks2);
      return tasks2;
    },
    create: async (taskData) => {
      const response = await fetch(`${API_BASE}/api/tasks/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(taskData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Ошибка создания задачи");
      }
      const task = await response.json();
      update((tasks2) => [...tasks2, task]);
      return task;
    },
    updateTask: async (taskId, taskData) => {
      const response = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(taskData)
      });
      const task = await response.json();
      update((tasks2) => tasks2.map((t) => t.id === taskId ? task : t));
      return task;
    },
    changeStatus: async (taskId, status, comment = null, extra = {}) => {
      const response = await fetch(`${API_BASE}/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ status, comment, ...extra })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Ошибка изменения статуса");
      }
      const task = await response.json();
      update((tasks2) => tasks2.map((t) => t.id === taskId ? task : t));
      return task;
    },
    undo: async (taskId) => {
      const response = await fetch(`${API_BASE}/api/tasks/${taskId}/undo`, {
        method: "POST",
        headers: getHeaders()
      });
      const task = await response.json();
      update((tasks2) => tasks2.map((t) => t.id === taskId ? task : t));
      return task;
    },
    take: async (taskId) => {
      const response = await fetch(`${API_BASE}/api/tasks/${taskId}/take`, {
        method: "POST",
        headers: getHeaders()
      });
      const task = await response.json();
      update((tasks2) => tasks2.map((t) => t.id === taskId ? task : t));
      return task;
    },
    delete: async (taskId) => {
      await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      update((tasks2) => tasks2.filter((t) => t.id !== taskId));
    }
  };
}
const tasks = createTasksStore();
const tasksByStatus = derived(tasks, ($tasks) => {
  const grouped = {
    new: [],
    in_progress: [],
    editor_review: [],
    client_approval: [],
    client_approved: [],
    sent_to_media: [],
    published: [],
    postponed: []
  };
  $tasks.forEach((task) => {
    if (grouped[task.status]) {
      grouped[task.status].push(task);
    }
  });
  const now = /* @__PURE__ */ new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1e3);
  Object.keys(grouped).forEach((status) => {
    grouped[status].sort((a, b) => {
      const aOverdue = new Date(a.status_changed_at) < threeDaysAgo;
      const bOverdue = new Date(b.status_changed_at) < threeDaysAgo;
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return new Date(a.status_changed_at) - new Date(b.status_changed_at);
    });
  });
  return grouped;
});
function createWebSocketStore() {
  const { subscribe, set, update } = writable({
    connected: false,
    reconnecting: false
  });
  const connect = () => {
    return;
  };
  const disconnect = () => {
  };
  const send = (message) => {
  };
  return {
    subscribe,
    connect,
    disconnect,
    send
  };
}
createWebSocketStore();

export { API_BASE as A, auth as a, tasksByStatus as t };
//# sourceMappingURL=websocket-wnrQWROL.js.map
