
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { login } from "@/utils/auth";

interface LoginContextType {
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleVolunteerLogin: (values: VolunteerLoginFormValues) => Promise<void>;
  handleOrganizerLogin: (values: OrganizerLoginFormValues) => Promise<void>;
  handleAdminLogin: (values: OrganizerLoginFormValues) => Promise<void>;
}

export interface VolunteerLoginFormValues {
  email: string;
  mobile: string;
  name: string;
  rememberMe: boolean;
}

export interface OrganizerLoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login: authLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("volunteer");

  const handleVolunteerLogin = async (values: VolunteerLoginFormValues) => {
    try {
      setIsLoading(true);
      
      const result = login(values.email, undefined, values.name, values.mobile);
      
      if (!result) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid credentials. Please check your details and try again.",
        });
        setIsLoading(false);
        return;
      }

      // Set auth state
      authLogin(result.user, result.token);
      
      // Redirect based on user role
      navigate("/volunteer/dashboard");
      setIsLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const handleOrganizerLogin = async (values: OrganizerLoginFormValues) => {
    try {
      setIsLoading(true);
      
      const result = login(values.email, values.password);
      
      if (!result) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid credentials. Please check your email and password.",
        });
        setIsLoading(false);
        return;
      }
      
      // Set auth state
      authLogin(result.user, result.token);
      
      // Redirect based on user role
      navigate("/organizer/dashboard");
      setIsLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (values: OrganizerLoginFormValues) => {
    try {
      setIsLoading(true);
      
      const result = login(values.email, values.password);
      
      if (!result) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid credentials. Please check your email and password.",
        });
        setIsLoading(false);
        return;
      }
      
      // Set auth state
      authLogin(result.user, result.token);
      
      // Redirect based on user role
      navigate("/admin/dashboard");
      setIsLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const value = {
    isLoading,
    activeTab,
    setActiveTab,
    handleVolunteerLogin,
    handleOrganizerLogin,
    handleAdminLogin
  };

  return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>;
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};
