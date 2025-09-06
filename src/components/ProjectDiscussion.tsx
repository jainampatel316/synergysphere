import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, MessageSquare } from "lucide-react";

interface Message {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

interface ProjectDiscussionProps {
  projectId: number;
}

// Mock messages data
const mockMessages: Message[] = [
  {
    id: 1,
    author: "John Doe",
    content: "Great progress on the design system! The color palette looks fantastic.",
    timestamp: "2024-01-16 14:30",
    avatar: ""
  },
  {
    id: 2,
    author: "Sarah Wilson", 
    content: "Thanks! I'm working on the mobile responsive components next. Should have them ready by tomorrow.",
    timestamp: "2024-01-16 14:35",
    avatar: ""
  },
  {
    id: 3,
    author: "Mike Johnson",
    content: "I've completed the frontend integration for user authentication. Ready for testing.",
    timestamp: "2024-01-16 15:20",
    avatar: ""
  }
];

const MessageItem = ({ message }: { message: Message }) => {
  return (
    <div className="flex space-x-3 p-4 hover:bg-muted/50 rounded-lg transition-colors">
      <Avatar className="w-8 h-8">
        <AvatarImage src={message.avatar} />
        <AvatarFallback className="text-xs">
          {message.author.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-sm">{message.author}</span>
          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
        </div>
        <p className="text-sm text-foreground">{message.content}</p>
      </div>
    </div>
  );
};

export const ProjectDiscussion = ({ projectId }: ProjectDiscussionProps) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now(),
      author: "You",
      content: newMessage,
      timestamp: new Date().toLocaleString(),
      avatar: ""
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageSquare className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Project Discussion</h3>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Team Chat</CardTitle>
          <CardDescription>
            Collaborate and discuss project updates with your team
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </div>
          
          <div className="p-4 border-t bg-muted/20">
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-primary text-primary-foreground border-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};