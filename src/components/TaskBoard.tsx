import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, AlertCircle } from "lucide-react";

interface Task {
  id: number;
  title: string;
  assignee: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
}

interface TaskBoardProps {
  tasks: {
    todo: Task[];
    inProgress: Task[];
    done: Task[];
  };
}

const TaskCard = ({ task }: { task: Task }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-info text-info-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
            <Badge variant="secondary" className={`${getPriorityColor(task.priority)} text-xs`}>
              {task.priority}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Avatar className="w-5 h-5">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">
                  {task.assignee.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span>{task.assignee}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskColumn = ({ title, tasks, count }: { title: string; tasks: Task[]; count: number }) => {
  return (
    <div className="flex-1">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {count}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export const TaskBoard = ({ tasks }: TaskBoardProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Task Board</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>Drag and drop to update status</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskColumn 
          title="To Do" 
          tasks={tasks.todo} 
          count={tasks.todo.length}
        />
        <TaskColumn 
          title="In Progress" 
          tasks={tasks.inProgress} 
          count={tasks.inProgress.length}
        />
        <TaskColumn 
          title="Done" 
          tasks={tasks.done} 
          count={tasks.done.length}
        />
      </div>
    </div>
  );
};