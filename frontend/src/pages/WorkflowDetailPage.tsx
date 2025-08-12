import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Play,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { workflowsAPI } from "@/lib/api";
import { WorkflowStep, WorkflowRun } from "@/lib/types";

export default function WorkflowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const workflowId = parseInt(id!);

  const { data: workflow } = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: () => workflowsAPI.get(workflowId),
    enabled: !!workflowId,
  });

  const { data: runs = [] } = useQuery({
    queryKey: ["workflow-runs", workflowId],
    queryFn: () => workflowsAPI.getRuns(workflowId),
    enabled: !!workflowId,
  });

  const handleRun = async () => {
    await workflowsAPI.run(workflowId);
    alert("Workflow executed successfully!");
  };

  if (!workflow) {
    return <div>Loading...</div>;
  }

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
              {workflow.name}
            </h1>
            <p className="text-muted-foreground">
              {workflow.description || "No description"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRun}>
            <Play className="mr-2 h-4 w-4" />
            Run Workflow
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/workflows/${workflowId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Workflow Info */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                workflow.status === "active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : workflow.status === "paused"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
              }`}
            >
              {workflow.status}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{workflow.steps?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{runs.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Steps</CardTitle>
          <CardDescription>
            The steps that will be executed in this workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workflow.steps && workflow.steps.length > 0 ? (
            <div className="space-y-4">
              {workflow.steps.map((step: WorkflowStep, index: number) => (
                <div
                  key={step.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{step.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Type: {step.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No steps configured yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Runs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Runs</CardTitle>
          <CardDescription>Execution history for this workflow</CardDescription>
        </CardHeader>
        <CardContent>
          {runs.length > 0 ? (
            <div className="space-y-4">
              {runs.slice(0, 10).map((run: WorkflowRun) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      {run.status === "success" && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {run.status === "failed" && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      {run.status === "running" && (
                        <Clock className="h-5 w-5 text-blue-500" />
                      )}
                      {run.status === "pending" && (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Run #{run.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(run.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        run.status === "success"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : run.status === "failed"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            : run.status === "running"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}
                    >
                      {run.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No runs yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
