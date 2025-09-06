import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, MessageSquare, Users, Calendar, MoreHorizontal } from "lucide-react";
import { Layout } from "@/components/Layout";
import { TaskBoard } from "@/components/TaskBoard";
import { ProjectDiscussion } from "@/components/ProjectDiscussion";
import { TeamMembers } from "@/components/TeamMembers";

// Mock project data
const projectData = {
  1: {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern design and improved user experience",
    progress: 75,
    status: "active",
    dueDate: "2024-02-15",
    members: [
      { id: 1, name: "John Doe", email: "john@example.com", avatar: "", role: "Project Manager" },
      { id: 2, name: "Sarah Wilson", email: "sarah@example.com", avatar: "", role: "Designer" },
      { id: 3, name: "Mike Johnson", email: "mike@example.com", avatar: "", role: "Developer" },
      { id: 4, name: "Lisa Chen", email: "lisa@example.com", avatar: "", role: "Developer" }
    ],
    tasks: {
      todo: [
        { id: 1, title: "Design mobile responsive layouts", assignee: "Sarah Wilson", priority: "high" as const, dueDate: "2024-01-20" },
        { id: 2, title: "Implement user authentication", assignee: "Mike Johnson", priority: "medium" as const, dueDate: "2024-01-25" }
      ],
      inProgress: [
        { id: 3, title: "Create component library", assignee: "Lisa Chen", priority: "high" as const, dueDate: "2024-01-18" },
        { id: 4, title: "API integration for user data", assignee: "Mike Johnson", priority: "medium" as const, dueDate: "2024-01-22" }
      ],
      done: [
        { id: 5, title: "Project setup and configuration", assignee: "John Doe", priority: "high" as const, dueDate: "2024-01-10" },
        { id: 6, title: "Design system documentation", assignee: "Sarah Wilson", priority: "low" as const, dueDate: "2024-01-12" },
        { id: 7, title: "Database schema design", assignee: "Mike Johnson", priority: "medium" as const, dueDate: "2024-01-15" }
      ]
    }
  }
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tasks");
  
  const project = projectData[Number(id) as keyof typeof projectData];
  
  if (!project) {
    return <div>Project not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-info text-info-foreground";
      case "review": return "bg-warning text-warning-foreground";
      case "completed": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const totalTasks = Object.values(project.tasks).flat().length;
  const completedTasks = project.tasks.done.length;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="p-0 h-auto"
          >
            Projects
          </Button>
          <span>&gt;</span>
          <span>{project.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            <Button 
              className="bg-gradient-primary text-primary-foreground border-0"
              onClick={() => navigate("/create-task")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{project.progress}%</div>
              <Progress value={project.progress} className="h-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}/{totalTasks}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.members.length}</div>
              <div className="flex -space-x-2 mt-2">
                {project.members.slice(0, 3).map((member) => (
                  <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {project.members.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Due Date</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Date(project.dueDate).getDate()}</div>
              <p className="text-xs text-muted-foreground">
                {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-96">
            <TabsTrigger value="tasks" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="discussion" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Discussion</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Team</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="mt-6">
            <TaskBoard tasks={project.tasks} />
          </TabsContent>
          
          <TabsContent value="discussion" className="mt-6">
            <ProjectDiscussion projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="team" className="mt-6">
            <TeamMembers members={project.members} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProjectDetail;