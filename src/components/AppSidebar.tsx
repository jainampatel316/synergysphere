import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { 
  Folder, 
  CheckSquare, 
  Settings, 
  Sun, 
  Moon,
  User,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { title: "Projects", url: "/dashboard", icon: Folder },
  { title: "My Tasks", url: "/my-tasks", icon: CheckSquare },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "hidden" : "block"}>
            Company
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className={`h-4 w-4 ${collapsed ? "mx-auto" : "mr-2"}`} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Theme Toggle and User Profile */}
        <div className={`mt-auto p-2 space-y-2 ${collapsed ? "flex flex-col items-center" : ""}`}>
          <div className={`flex ${collapsed ? "flex-col space-y-2" : "items-center space-x-2"}`}>
            <Button
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="w-8 h-8"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {!collapsed && (
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Settings className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="w-8 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
            {collapsed && (
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className={`flex ${collapsed ? "justify-center" : "items-center space-x-2"} p-2 rounded-lg hover:bg-muted/50`}>
            <Avatar className="w-8 h-8">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">TU</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Test User</p>
                <p className="text-xs text-muted-foreground truncate">user@email</p>
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}