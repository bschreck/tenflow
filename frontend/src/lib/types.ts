export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  id?: number;
  name: string;
  type: string;
  position: number;
  configuration: Record<string, any>;
}

export interface Workflow {
  id: number;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'stopped';
  steps: WorkflowStep[];
  created_at: string;
  updated_at: string;
  owner_id: number;
}

export interface WorkflowRun {
  id: number;
  workflow_id: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  result?: Record<string, any>;
}

export interface CreateWorkflowRequest {
  name: string;
  description?: string;
  status?: 'draft' | 'active' | 'paused' | 'stopped';
  steps: Omit<WorkflowStep, 'id'>[];
}

export interface UpdateWorkflowRequest extends Partial<CreateWorkflowRequest> {
  id?: never; // Prevent id from being passed in update
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
