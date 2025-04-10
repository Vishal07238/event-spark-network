
import { LoginProvider } from "@/components/auth/LoginContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthLayout from "@/layouts/AuthLayout";
import VolunteerLoginForm from "@/components/auth/VolunteerLoginForm";
import OrganizerLoginForm from "@/components/auth/OrganizerLoginForm";
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import LoginCredentialHelp from "@/components/auth/LoginCredentialHelp";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/components/auth/LoginContext";

export function LoginTabs() {
  const { activeTab, setActiveTab } = useLogin();
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
          <TabsTrigger value="organizer">Organizer</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {activeTab === "volunteer" && <VolunteerLoginForm />}
          {activeTab === "organizer" && (
            <div>
              <OrganizerLoginForm />
              <div className="mt-4 flex justify-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/organizer/register")}
                  className="flex items-center gap-2 text-primary"
                >
                  <UserPlus className="h-4 w-4" />
                  Register New Organizer
                </Button>
              </div>
            </div>
          )}
          {activeTab === "admin" && <AdminLoginForm />}
          
          <LoginCredentialHelp role={activeTab} />
        </div>
      </Tabs>
    </div>
  );
}

export default function Login() {
  return (
    <LoginProvider>
      <AuthLayout 
        title="Welcome back" 
        subtitle="Sign in to access your account" 
        type="login"
      >
        <LoginTabs />
      </AuthLayout>
    </LoginProvider>
  );
}
