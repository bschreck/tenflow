import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  Save,
  Trash2,
  GripVertical,
  Zap,
  Clock,
  Filter,
  Send,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { workflowsAPI } from "@/lib/api";
import { WorkflowStep, UpdateWorkflowRequest } from "@/lib/types";

const stepTypes = [
  {
    value: "trigger",
    label: "Trigger",
    icon: Zap,
    description: "Start the workflow",
  },
  {
    value: "action",
    label: "Action",
    icon: Send,
    description: "Perform an action",
  },
  {
    value: "condition",
    label: "Condition",
    icon: Filter,
    description: "Add conditional logic",
  },
  {
    value: "delay",
    label: "Delay",
    icon: Clock,
    description: "Wait for a period",
  },
];

export default function WorkflowBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const workflowId = id ? parseInt(id) : undefined;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<WorkflowStep[]>([]);

  const { data: workflow } = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: () => workflowsAPI.get(workflowId!),
    enabled: !!workflowId,
  });

  useEffect(() => {
    if (workflow) {
      setName(workflow.name);
      setDescription(workflow.description || "");
      setSteps(workflow.steps || []);
    }
  }, [workflow]);

  const createMutation = useMutation({
    mutationFn: workflowsAPI.create,
    onSuccess: () => {
      navigate("/workflows");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateWorkflowRequest) =>
      workflowsAPI.update(workflowId!, data),
    onSuccess: () => {
      navigate("/workflows");
    },
  });

  const handleSave = () => {
    const data = {
      name,
      description,
      status: "draft" as const,
      steps: steps.map((step, index) => ({
        name: step.name,
        type: step.type,
        position: index,
        configuration: {},
      })),
    };

    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const addStep = (type: string) => {
    const newStep = {
      id: Date.now(),
      name: `New ${type}`,
      type,
      configuration: {},
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, updates: Partial<WorkflowStep>) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    setSteps(newSteps);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/workflows">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? "Edit Workflow" : "Create Workflow"}
            </h1>
            <p className="text-muted-foreground">
              Design your automation workflow
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={!name}>
          <Save className="mr-2 h-4 w-4" />
          Save Workflow
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Give your workflow a name and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workflow Name</Label>
                <Input
                  id="name"
                  placeholder="Enter workflow name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  placeholder="Describe what this workflow does"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Workflow Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Steps</CardTitle>
              <CardDescription>
                Add and configure the steps in your workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              {steps.length > 0 ? (
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.id || index}
                      className="flex items-start space-x-4 p-4 border rounded-lg"
                    >
                      <div className="flex-shrink-0 pt-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">
                              {step.type}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStep(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Step name"
                          value={step.name}
                          onChange={(e) =>
                            updateStep(index, { name: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Zap className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    No steps added yet. Add your first step from the sidebar.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Steps</CardTitle>
              <CardDescription>
                Choose from available step types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {stepTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.value}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addStep(type.value)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div>{type.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {type.description}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Start with a trigger to define when your workflow runs</p>
              <p>• Add actions to perform tasks</p>
              <p>• Use conditions for branching logic</p>
              <p>• Add delays to wait between actions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
