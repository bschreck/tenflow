import axios from "axios";
import type {
  AuthResponse,
  RegisterRequest,
  User,
  OnboardingFormData,
  TrainingProgression,
  TrainingPlan,
  TrainingPlanCreate,
} from "@/types";

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
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post<AuthResponse>("/auth/login", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

// Onboarding API
export const submitOnboardingData = async (data: OnboardingFormData): Promise<void> => {
  // TODO: Implement actual API call when backend endpoint is ready
  console.log('Submitting onboarding data:', data);
  
  // For now, just log the data and resolve
  // Future implementation:
  // const response = await api.post("/onboarding", data);
  // return response.data;
};

export const getTrainingProgression = async (formData: OnboardingFormData): Promise<TrainingProgression> => {
  // TODO: Implement actual API call when backend endpoint is ready
  console.log('Fetching training progression for:', formData);
  
  // Mock data based on user's selections - this would come from the backend
  const goalData = formData.selectedGoal;
  const fitnessData = formData.fitnessData;
  
  // Calculate mock progression data
  let programDuration = 12; // default weeks
  let intensityLevel = 'Moderate';
  
  // Duration based on goal
  if (goalData?.distance.includes('100') || goalData?.distance.includes('200')) {
    programDuration = 40;
  } else if (goalData?.distance.includes('50')) {
    programDuration = 24;
  } else if (goalData?.distance.toLowerCase().includes('marathon')) {
    programDuration = 16;
  }
  
  // Intensity based on fitness level
  switch (fitnessData?.fitnessLevel) {
    case 'beginner':
      intensityLevel = 'Easy';
      break;
    case 'recreational':
      intensityLevel = 'Moderate';
      break;
    case 'competitive':
      intensityLevel = 'High';
      break;
    case 'elite':
      intensityLevel = 'Elite Intensity';
      break;
    default:
      intensityLevel = 'Moderate';
  }
  
  const currentWeeklyHours = fitnessData?.weeklyHours || 5;
  const peakWeeklyHours = Math.round(currentWeeklyHours * 2.6); // Slightly higher multiplier
  const trainingDaysPerWeek = fitnessData?.trainingDays || 4;
  const weeklyIncrease = Math.max(1, Math.round((peakWeeklyHours - currentWeeklyHours) / (programDuration * 0.6))); // Progressive increase
  
  const mockProgression: TrainingProgression = {
    programDuration,
    intensityLevel,
    currentWeeklyHours,
    peakWeeklyHours,
    trainingDaysPerWeek,
    weeklyIncrease
  };
  
  console.log('Generated training progression:', mockProgression);
  
  // Future implementation:
  // const response = await api.post("/training/progression", formData);
  // return response.data;
  
  return mockProgression;
};

// Training Plan API
export const trainingPlanAPI = {
  create: async (data: TrainingPlanCreate): Promise<TrainingPlan> => {
    const response = await api.post<TrainingPlan>("/training-plans/", data);
    return response.data;
  },

  getAll: async (params?: { skip?: number; limit?: number; is_active?: boolean }): Promise<TrainingPlan[]> => {
    const response = await api.get<TrainingPlan[]>("/training-plans/", { params });
    return response.data;
  },

  getById: async (id: string): Promise<TrainingPlan> => {
    const response = await api.get<TrainingPlan>(`/training-plans/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<TrainingPlanCreate>): Promise<TrainingPlan> => {
    const response = await api.put<TrainingPlan>(`/training-plans/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/training-plans/${id}`);
  },

  getCount: async (is_active?: boolean): Promise<{ count: number }> => {
    const params = is_active !== undefined ? { is_active } : {};
    const response = await api.get<{ count: number }>("/training-plans/stats/count", { params });
    return response.data;
  },
};

// Helper function to create a training plan from onboarding data
export const createTrainingPlanFromOnboarding = async (formData: OnboardingFormData): Promise<TrainingPlan> => {
  const goalData = formData.selectedGoal;
  const fitnessData = formData.fitnessData;
  
  if (!goalData || !fitnessData) {
    throw new Error('Missing required onboarding data');
  }
  
  // Calculate dates
  const startDate = new Date();
  let durationWeeks = 12; // default
  
  // Duration based on goal
  if (goalData.distance.includes('100') || goalData.distance.includes('200')) {
    durationWeeks = 40;
  } else if (goalData.distance.includes('50')) {
    durationWeeks = 24;
  } else if (goalData.distance.toLowerCase().includes('marathon')) {
    durationWeeks = 16;
  }
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + (durationWeeks * 7));
  
  // Map fitness level to intensity
  let fitnessLevel = 'moderate';
  switch (fitnessData.fitnessLevel) {
    case 'beginner':
      fitnessLevel = 'beginner';
      break;
    case 'recreational':
      fitnessLevel = 'intermediate';
      break;
    case 'competitive':
      fitnessLevel = 'advanced';
      break;
    case 'elite':
      fitnessLevel = 'elite';
      break;
  }
  
  const trainingPlanData: TrainingPlanCreate = {
    goal: goalData.name,
    plan_name: `${goalData.name} Training Plan`,
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
    duration_weeks: durationWeeks,
    fitness_level: fitnessLevel,
    weekly_distance_base: fitnessData.weeklyHours * 8, // Rough conversion from hours to distance
    weekly_distance_peak: fitnessData.weeklyHours * 20, // Peak distance
    training_days_per_week: fitnessData.trainingDays,
    plan_data: {
      onboardingData: formData,
      trailExperience: fitnessData.trailExperience,
      injuryHistory: fitnessData.injuryHistory,
    },
    is_active: true,
  };
  
  return trainingPlanAPI.create(trainingPlanData);
};
