
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users, Building2 } from "lucide-react";
import AuthLayout from "@/layouts/AuthLayout";
import { LoginProvider, useLogin } from "@/components/auth/LoginContext";
import VolunteerLoginForm from "@/components/auth/VolunteerLoginForm";
import OrganizerLoginForm from "@/components/auth/OrganizerLoginForm";
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import LoginCredentialHelp from "@/components/auth/LoginCredentialHelp";

// Main login container that provides the LoginContext
export default function Login() {
  return (
    <LoginProvider>
      <LoginContent />
    </LoginProvider>
  );
}

// Separate component to use the login context hooks
function LoginContent() {
  const { activeTab, setActiveTab } = useLogin();

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
          <VolunteerLoginForm />
        </TabsContent>
        
        {/* Organizer Login Form */}
        <TabsContent value="organizer" className="animate-fade-in">
          <OrganizerLoginForm />
        </TabsContent>
        
        {/* Admin Login Form */}
        <TabsContent value="admin" className="animate-fade-in">
          <AdminLoginForm />
        </TabsContent>
      </Tabs>
      
      <LoginCredentialHelp />
    </AuthLayout>
  );
}
