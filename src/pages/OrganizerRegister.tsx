
import OrganizerRegistrationForm from "@/components/auth/OrganizerRegistrationForm";
import AuthLayout from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function OrganizerRegister() {
  const navigate = useNavigate();
  
  return (
    <AuthLayout 
      title="Create an Organizer Account" 
      subtitle="Sign up to manage events and volunteers" 
      type="register"
    >
      <OrganizerRegistrationForm />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button 
            variant="link" 
            className="p-0 text-primary" 
            onClick={() => navigate("/login")}
          >
            Log in
          </Button>
        </p>
      </div>
    </AuthLayout>
  );
}
