import axios from "axios";
import type {
  Workflow,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  AuthResponse,
  RegisterRequest,
  User,
  WorkflowRun,
} from "./types";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const API_BASE_URL = backendUrl.replace(/\/$/, "") + "/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

// Auth API
export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await api.post<AuthResponse>("/auth/login", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response", response);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<User>("/users/", data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/users/me");
    return response.data;
  },
};

// Workflows API
export const workflowsAPI = {
  list: async (): Promise<Workflow[]> => {
    const response = await api.get<Workflow[]>("/workflows/");
    return response.data;
  },

  get: async (id: number): Promise<Workflow> => {
    const response = await api.get<Workflow>(`/workflows/${id}`);
    return response.data;
  },

  create: async (data: CreateWorkflowRequest): Promise<Workflow> => {
    const response = await api.post<Workflow>("/workflows/", data);
    return response.data;
  },

  update: async (
    id: number,
    data: UpdateWorkflowRequest,
  ): Promise<Workflow> => {
    const response = await api.put<Workflow>(`/workflows/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/workflows/${id}`);
  },

  run: async (id: number): Promise<WorkflowRun> => {
    const response = await api.post<WorkflowRun>(`/workflows/${id}/run`);
    return response.data;
  },

  getRuns: async (id: number): Promise<WorkflowRun[]> => {
    const response = await api.get<WorkflowRun[]>(`/workflows/${id}/runs`);
    return response.data;
  },
};
