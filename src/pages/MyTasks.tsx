import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MoreHorizontal, Calendar, Users } from "lucide-react";
import { Layout } from "@/components/Layout";

interface Task {
  id: number;
  title: string;
  project: string;
  assignee: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  status: "todo" | "inProgress" | "done";
  image?: string;
}

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: 1,
    title: "Optimize Website Controllers",
    project: "RD Sales",
    assignee: "You",
    priority: "high",
    dueDate: "2024-01-20",
    status: "inProgress",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Update API Documentation",
    project: "Backend Service",
    assignee: "You", 
    priority: "medium",
    dueDate: "2024-01-25",
    status: "todo",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Design System Updates",
    project: "UI Library",
    assignee: "You",
    priority: "low", 
    dueDate: "2024-01-30",
    status: "done",
    image: "/placeholder.svg"
  }
];

const TaskCard = ({ task }: { task: Task }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-info text-info-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done": return "bg-success text-success-foreground";
      case "inProgress": return "bg-warning text-warning-foreground";
      case "todo": return "bg-info text-info-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Task Image */}
          <div className="w-full h-32 bg-gradient-primary rounded-lg flex items-center justify-center">
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded"></div>
              <div className="w-8 h-8 bg-white/30 rounded"></div>
              <div className="w-8 h-8 bg-white/40 rounded"></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="secondary" className={`${getPriorityColor(task.priority)} text-xs mb-1`}>
                  {task.priority}
                </Badge>
                <h4 className="font-medium text-sm">{task.title}</h4>
                <p className="text-xs text-muted-foreground">Project: {task.project}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <Avatar className="w-4 h-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xs">{task.assignee.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">{task.assignee}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <Badge variant="secondary" className={`${getStatusColor(task.status)} text-xs`}>
                  {task.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MyTasks = () => {
  const [tasks] = useState<Task[]>(mockTasks);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Tasks</h1>
            <p className="text-muted-foreground">Manage your assigned tasks across all projects</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
            <Button className="bg-gradient-primary text-primary-foreground border-0">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No tasks assigned</h3>
            <p className="text-muted-foreground mb-4">You don't have any tasks assigned to you yet.</p>
            <Button className="bg-gradient-primary text-primary-foreground border-0">
              <Plus className="h-4 w-4 mr-2" />
              Create First Task
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyTasks;