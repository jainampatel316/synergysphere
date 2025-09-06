import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectCard } from "@/components/ProjectCard";
import { Plus, Calendar, Users, BarChart3 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

// Mock data following wireframe specifications
const projects = [
  {
    id: "1",
    title: "RD Services",
    tags: [
      { label: "Services", color: "green" },
      { label: "Customer Care", color: "red" }
    ],
    image: "/placeholder-project.jpg",
    deadline: "21/03/22",
    taskCount: 10,
    manager: {
      name: "John Doe",
      avatar: ""
    }
  },
  {
    id: "2", 
    title: "Mobile App Development",
    tags: [
      { label: "Development", color: "green" },
      { label: "Mobile", color: "green" }
    ],
    image: "/placeholder-project.jpg",
    deadline: "15/04/22",
    taskCount: 15,
    manager: {
      name: "Jane Smith", 
      avatar: ""
    }
  },
  {
    id: "3",
    title: "Marketing Campaign",
    tags: [
      { label: "Marketing", color: "green" },
      { label: "Urgent", color: "red" }
    ],
    image: "/placeholder-project.jpg", 
    deadline: "31/01/22",
    taskCount: 8,
    manager: {
      name: "Mike Johnson",
      avatar: ""
    }
  }
];

const recentActivity = [
  { id: 1, text: "John completed 'Design wireframes' task", time: "2 hours ago" },
  { id: 2, text: "Sarah added new comment to Mobile App project", time: "4 hours ago" },
  { id: 3, text: "Mike assigned 'UI Integration' to you", time: "6 hours ago" }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleEditProject = (id: string) => {
    toast({
      title: "Edit Project",
      description: `Editing project ${id}`,
    });
  };

  const handleDeleteProject = (id: string) => {
    toast({
      title: "Delete Project", 
      description: `Project ${id} deleted`,
      variant: "destructive",
    });
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, John!</h2>
          <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 active, 1 in review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+12 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">13</div>
              <p className="text-xs text-muted-foreground">Across all projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">70%</div>
              <p className="text-xs text-muted-foreground">+5% from last week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Your Projects</h3>
              <Button 
                className="bg-gradient-primary text-primary-foreground border-0"
                onClick={() => navigate("/create-project")}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <div key={project.id} onClick={() => navigate(`/project/${project.id}`)} className="cursor-pointer">
                  <ProjectCard
                    {...project}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;