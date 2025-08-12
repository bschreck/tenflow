import { components } from "./generated_types";

// Authentication types
export type LoginRequest =
  components["schemas"]["Body_login_api_v1_auth_login_post"];
export type AuthResponse = components["schemas"]["Token"];

// User types
export type User = components["schemas"]["UserRead"];
export type UserCreate = components["schemas"]["UserCreate"];
export type UserUpdate = components["schemas"]["UserUpdate"];

// Workflow types
export type Workflow = components["schemas"]["WorkflowRead"];
export type WorkflowCreate = components["schemas"]["WorkflowCreate"];
export type WorkflowUpdate = components["schemas"]["WorkflowUpdate"];
export type WorkflowStatus = components["schemas"]["WorkflowStatus"];

// Workflow step types
export type WorkflowStep = components["schemas"]["WorkflowStepRead"];
export type WorkflowStepCreate = components["schemas"]["WorkflowStepCreate"];

// Workflow run types
export type WorkflowRun = components["schemas"]["WorkflowRunRead"];
export type RunStatus = components["schemas"]["RunStatus"];

// Request types for forms/API calls
export type CreateWorkflowRequest = components["schemas"]["WorkflowCreate"];
export type UpdateWorkflowRequest = components["schemas"]["WorkflowUpdate"];
export type RegisterRequest = components["schemas"]["UserCreate"];
