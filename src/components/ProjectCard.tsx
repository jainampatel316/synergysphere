import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, MoreHorizontal } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  tags: Array<{ label: string; color: string }>;
  image: string;
  deadline: string;
  taskCount: number;
  manager: {
    name: string;
    avatar: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ 
  id, 
  title, 
  tags, 
  image, 
  deadline, 
  taskCount, 
  manager, 
  onEdit, 
  onDelete 
}: ProjectCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-border bg-card">
      <CardContent className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className={`text-xs ${
                tag.color === 'green' 
                  ? 'bg-success/10 text-success border-success/20' 
                  : 'bg-destructive/10 text-destructive border-destructive/20'
              }`}
            >
              {tag.label}
            </Badge>
          ))}
        </div>

        {/* Project Title and Menu */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-lg text-card-foreground line-clamp-2 flex-1">
            {title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
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

        {/* Project Image */}
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
          <div className="flex items-center space-x-4">
            {/* Deadline */}
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">{deadline}</span>
            </div>
            
            {/* Project Manager */}
            <Avatar className="h-6 w-6">
              <AvatarImage src={manager.avatar} />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {manager.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Task Count */}
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span className="text-sm">{taskCount} tasks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}