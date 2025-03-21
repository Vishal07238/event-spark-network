
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users, Building2 } from "lucide-react";
import AuthLayout from "@/layouts/AuthLayout";

// Define volunteer form schema
const volunteerLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  mobile: z.string().min(10, { message: "Please enter a valid mobile number." }).optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).optional(),
  rememberMe: z.boolean().default(false),
});

// Define organizer form schema
const organizerLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean().default(false),
});

type VolunteerLoginFormValues = z.infer<typeof volunteerLoginSchema>;
type OrganizerLoginFormValues = z.infer<typeof organizerLoginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("volunteer");

  // Initialize volunteer form
  const volunteerForm = useForm<VolunteerLoginFormValues>({
    resolver: zodResolver(volunteerLoginSchema),
    defaultValues: {
      email: "",
      mobile: "",
      name: "",
      rememberMe: false,
    },
  });

  // Initialize organizer form
  const organizerForm = useForm<OrganizerLoginFormValues>({
    resolver: zodResolver(organizerLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Volunteer form submission handler
  const onVolunteerSubmit = async (values: VolunteerLoginFormValues) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      console.log("Volunteer login form values:", values);
      
      // Simulate login success after 1 second
      setTimeout(() => {
        toast({
          title: "Login successful",
          description: "Welcome back to VolunteerHub!",
        });
        
        navigate("/volunteer/dashboard");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      });
      setIsLoading(false);
    }
  };

  // Organizer form submission handler
  const onOrganizerSubmit = async (values: OrganizerLoginFormValues) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      console.log("Organizer login form values:", values);
      
      // Simulate login success after 1 second
      setTimeout(() => {
        toast({
          title: "Login successful",
          description: "Welcome back to VolunteerHub!",
        });
        
        navigate("/organizer/dashboard");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Enter your credentials to access your account"
      type="login"
    >
      <Tabs defaultValue="volunteer" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="volunteer">
            <User className="mr-2 h-4 w-4" />
            Volunteer
          </TabsTrigger>
          <TabsTrigger value="organizer">
            <Building2 className="mr-2 h-4 w-4" />
            Organizer
          </TabsTrigger>
          <TabsTrigger value="admin">
            <Users className="mr-2 h-4 w-4" />
            Admin
          </TabsTrigger>
        </TabsList>
        
        {/* Volunteer Login Form */}
        <TabsContent value="volunteer" className="animate-fade-in">
          <Form {...volunteerForm}>
            <form onSubmit={volunteerForm.handleSubmit(onVolunteerSubmit)} className="space-y-4">
              <FormField
                control={volunteerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={volunteerForm.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="1234567890"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={volunteerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={volunteerForm.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In as Volunteer"}
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        {/* Organizer Login Form */}
        <TabsContent value="organizer" className="animate-fade-in">
          <Form {...organizerForm}>
            <form onSubmit={organizerForm.handleSubmit(onOrganizerSubmit)} className="space-y-4">
              <FormField
                control={organizerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your-org@example.com"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={organizerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <a
                        href="#"
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/forgot-password");
                        }}
                      >
                        Forgot password?
                      </a>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={organizerForm.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In as Organizer"}
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        {/* Admin Login Form */}
        <TabsContent value="admin" className="animate-fade-in">
          <Form {...organizerForm}>
            <form onSubmit={organizerForm.handleSubmit(onOrganizerSubmit)} className="space-y-4">
              <FormField
                control={organizerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@volunteerhub.com"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={organizerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <a
                        href="#"
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/forgot-password");
                        }}
                      >
                        Forgot password?
                      </a>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={organizerForm.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In as Admin"}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 text-center text-sm">
        {activeTab === "volunteer" && (
          <div className="text-center text-sm text-muted-foreground">
            <span>For demo, use:</span>
            <div className="flex flex-col sm:flex-row text-xs gap-2 justify-center mt-1">
              <span className="bg-muted px-2 py-1 rounded">volunteer@example.com</span>
            </div>
            <span className="block mt-1">Name: John Doe, Mobile: 1234567890</span>
          </div>
        )}
        
        {activeTab === "organizer" && (
          <div className="text-center text-sm text-muted-foreground">
            <span>For demo, use:</span>
            <div className="flex flex-col sm:flex-row text-xs gap-2 justify-center mt-1">
              <span className="bg-muted px-2 py-1 rounded">organizer@example.com</span>
            </div>
            <span className="block mt-1">Password: password123</span>
          </div>
        )}
        
        {activeTab === "admin" && (
          <div className="text-center text-sm text-muted-foreground">
            <span>For demo, use:</span>
            <div className="flex flex-col sm:flex-row text-xs gap-2 justify-center mt-1">
              <span className="bg-muted px-2 py-1 rounded">admin@example.com</span>
            </div>
            <span className="block mt-1">Password: admin123</span>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
