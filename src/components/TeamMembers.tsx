import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Mail, Plus, MoreHorizontal } from "lucide-react";

interface Member {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface TeamMembersProps {
  members: Member[];
}

const MemberCard = ({ member }: { member: Member }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={member.avatar} />
            <AvatarFallback>
              {member.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-medium">{member.name}</h4>
            <p className="text-sm text-muted-foreground flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {member.email}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{member.role}</Badge>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const TeamMembers = ({ members }: TeamMembersProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Team Members</h3>
          <Badge variant="secondary">{members.length}</Badge>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground border-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Team Overview</CardTitle>
          <CardDescription>
            Team composition and roles distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Project Managers</span>
              <Badge variant="secondary">
                {members.filter(m => m.role === "Project Manager").length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Designers</span>
              <Badge variant="secondary">
                {members.filter(m => m.role === "Designer").length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Developers</span>
              <Badge variant="secondary">
                {members.filter(m => m.role === "Developer").length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};