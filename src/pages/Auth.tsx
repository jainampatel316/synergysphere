import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: type === 'login' ? "Welcome back!" : "Account created!",
        description: type === 'login' ? "You've been logged in successfully." : "Your account has been created successfully.",
      });
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-foreground">SynergySphere</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Home</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Solutions</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Work</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">About</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Legal</a>
              <Button variant="outline" size="sm">Sign Up</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center bg-gradient-primary p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-foreground mb-2">Create an account</h1>
            <p className="text-primary-foreground/80">Join our collaboration platform</p>
          </div>
          
          <Card className="border-0 shadow-xl bg-background/95 backdrop-blur">
            <CardHeader className="space-y-1">
              <div className="flex justify-end">
                <Button variant="link" size="sm" className="text-muted-foreground">
                  log in instead
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signup" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={(e) => handleAuth(e, 'login')} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-primary border-0 text-primary-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={(e) => handleAuth(e, 'signup')} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-sm text-muted-foreground">First Name</Label>
                      <Input
                        id="first-name"
                        type="text"
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-sm text-muted-foreground">Last Name</Label>
                      <Input
                        id="last-name"
                        type="text"
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm text-muted-foreground">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm text-muted-foreground">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <label htmlFor="terms" className="text-xs text-muted-foreground">
                        By creating an account, I agree to our <a href="#" className="underline">Terms of use</a> and <a href="#" className="underline">Privacy Policy</a>
                      </label>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-muted text-muted-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create an account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Banner */}
            <div className="space-y-4">
              <div className="w-32 h-20 bg-muted rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Company's Banner</span>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Some important</p>
                <p className="text-xs text-muted-foreground">Quick Links to be</p>
                <p className="text-xs text-muted-foreground">accessed</p>
                <p className="text-xs text-muted-foreground">(Optional)</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Quick Links</h4>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded"></div>
              </div>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Company</h4>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded"></div>
              </div>
            </div>

            {/* Connect with us */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Connect with us</h4>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded"></div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Some quick social media links</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Auth;