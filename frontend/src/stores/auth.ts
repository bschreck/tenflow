import { create } from "zustand";

import { authAPI } from "@/lib/api";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerAndLogin: (email: string, password: string, full_name: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    localStorage.setItem("access_token", response.access_token);
    const user = await authAPI.getCurrentUser();
    set({ user, isAuthenticated: true });
  },

  registerAndLogin: async (email: string, password: string, full_name: string) => {
    // First register the user
    await authAPI.register({
      email,
      password,
      full_name: full_name || null,
      is_active: true,
      is_superuser: false,
    });
    
    // Then immediately log them in
    const response = await authAPI.login(email, password);
    localStorage.setItem("access_token", response.access_token);
    const user = await authAPI.getCurrentUser();
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    set({ user: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem("access_token");
      if (!token) {
        set({ isLoading: false });
        return;
      }
      const user = await authAPI.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem("access_token");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
