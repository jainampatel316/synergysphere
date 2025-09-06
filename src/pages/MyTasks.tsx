import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/TaskCard";
import { Plus, MoreHorizontal, Users } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

// Mock task data following the wireframe specifications
const mockTasks = [
  {
    id: "1",
    title: "Optimise Website Controllers",
    project: "RD Sales",
    tags: [
      { label: "Feedback", color: "green" },
      { label: "Bug", color: "red" }
    ],
    image: "/placeholder-task.jpg",
    deadline: "21/03/22",
    assignee: {
      name: "John Doe",
      avatar: ""
    }
  },
  {
    id: "2",
    title: "Implement user authentication",
    project: "Mobile App",
    tags: [
      { label: "Development", color: "green" },
      { label: "Security", color: "yellow" }
    ],
    image: "/placeholder-task.jpg", 
    deadline: "15/04/22",
    assignee: {
      name: "Jane Smith",
      avatar: ""
    }
  },
  {
    id: "3",
    title: "Write API documentation",
    project: "Backend Services",
    tags: [
      { label: "Documentation", color: "green" },
      { label: "API", color: "green" }
    ],
    image: "/placeholder-task.jpg",
    deadline: "25/01/22",
    assignee: {
      name: "Mike Johnson", 
      avatar: ""
    }
  }
];


const MyTasks = () => {
  const { toast } = useToast();

  const handleEditTask = (id: string) => {
    toast({
      title: "Edit Task",
      description: `Editing task ${id}`,
    });
  };

  const handleDeleteTask = (id: string) => {
    toast({
      title: "Delete Task",
      description: `Task ${id} deleted`, 
      variant: "destructive",
    });
  };

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
          {mockTasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>

        {/* Empty State */}
        {mockTasks.length === 0 && (
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