import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectCard } from "@/components/ProjectCard";
import { Plus, Calendar, Users, BarChart3 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { projectsAPI, tasksAPI } from "@/services/api";

interface Project {
  _id: string;
  name: string;
  description: string;
  progress: number;
  dueDate?: string;
  members: string[];
  owner: string;
  createdAt: string;
}

interface Task {
  _id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  dueDate?: string;
  projectId: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects and tasks in parallel
        const [projectsData, tasksData] = await Promise.all([
          projectsAPI.getAll(),
          tasksAPI.getMyTasks({ limit: 5 }) // Get recent tasks
        ]);
        
        setProjects(projectsData);
        setMyTasks(tasksData.tasks || tasksData);
        
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error loading dashboard",
          description: error.message || "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleCreateProject = () => {
    navigate("/create-project");
  };

  const handleEditProject = (id: string) => {
    navigate(`/project/${id}`);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      // Add delete API call here when ready
      toast({
        title: "Delete Project", 
        description: `Project deleted successfully`,
        variant: "destructive",
      });
      // Refresh projects list
      const projectsData = await projectsAPI.getAll();
      setProjects(projectsData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive"
      });
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString();
  };

  // Convert backend project to ProjectCard format
  const convertToProjectCardData = (project: Project) => ({
    id: project._id,
    title: project.name,
    tags: [
      { label: `${Math.round(project.progress)}% Complete`, color: "green" },
      { label: project.members.length > 1 ? "Team Project" : "Solo", color: "blue" }
    ],
    image: "/placeholder-project.jpg",
    deadline: formatDate(project.dueDate),
    taskCount: 0, // Will be updated when we have task counts
    manager: {
      name: user?.name || "You",
      avatar: ""
    }
  });

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h2>
          <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
        </div>

        {/* Stats Cards - Simple version */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">
                Active projects
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                Tasks assigned to you
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.reduce((total, project) => total + project.members.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all projects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Projects</h3>
              <Button onClick={handleCreateProject} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Project
              </Button>
            </div>

            {projects.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground mb-4">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                  <p>Create your first project to get started with team collaboration.</p>
                </div>
                <Button onClick={handleCreateProject} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    {...convertToProjectCardData(project)}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Recent Tasks</h3>
            <Card>
              <CardContent className="p-6">
                {myTasks.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent tasks</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myTasks.slice(0, 5).map((task) => (
                      <div key={task._id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          task.status === 'done' ? 'bg-green-500' :
                          task.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {task.status === 'done' ? 'Completed' :
                             task.status === 'in_progress' ? 'In Progress' : 'To Do'}
                            {task.dueDate && ` • Due ${formatDate(task.dueDate)}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
