import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MoreHorizontal } from "lucide-react";

interface TaskCardProps {
  id: string;
  title: string;
  project?: string; // For My Tasks view
  tags: Array<{ label: string; color: string }>;
  image: string;
  deadline: string;
  assignee: {
    name: string;
    avatar: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({ 
  id, 
  title, 
  project, 
  tags, 
  image, 
  deadline, 
  assignee, 
  onEdit, 
  onDelete 
}: TaskCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-border bg-card">
      <CardContent className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              className={`text-xs border-transparent ${
                tag.color === 'green'
                  ? 'bg-success/10 text-success border-success/20'
                  : tag.color === 'red'
                  ? 'bg-destructive/10 text-destructive border-destructive/20'
                  : 'bg-warning/10 text-warning border-warning/20'
              }`}
            >
              {tag.label}
            </Badge>
          ))}
        </div>

        {/* Project Name (for My Tasks view) */}
        {project && (
          <div className="mb-2">
            <span className="text-sm font-medium text-muted-foreground">Project: {project}</span>
          </div>
        )}

        {/* Task Title and Menu */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-lg text-card-foreground line-clamp-2 flex-1">
            {title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-8 w-8 p-0 flex items-center justify-center hover:bg-accent rounded-md"
                aria-label="Task actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onEdit?.(id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(id)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Task Image */}
        <div className="mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 h-32">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Deadline */}
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-sm">{deadline}</span>
          </div>
          
          {/* Task Assignee */}
          <Avatar className="h-6 w-6">
            <AvatarImage src={assignee.avatar} />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {assignee.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
}