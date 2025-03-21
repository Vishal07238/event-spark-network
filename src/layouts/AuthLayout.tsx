
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  type: "login" | "register";
}

export default function AuthLayout({ children, title, subtitle, type }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image and branding */}
      <div className="hidden md:flex md:w-1/2 bg-primary p-8 text-white flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-semibold tracking-tight">VolunteerHub</h1>
            <p className="text-primary-foreground/80 mt-2">Connect. Contribute. Change lives.</p>
          </div>
          
          <div className="mt-20 space-y-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div>
              <h2 className="text-2xl font-medium">Make a difference</h2>
              <p className="mt-2 text-primary-foreground/80 max-w-md">Join our community of passionate volunteers and create meaningful impact in communities around the world.</p>
            </div>
            
            <div className="max-w-md">
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md">
                <p className="text-sm italic text-primary-foreground/90">
                  "The best way to find yourself is to lose yourself in the service of others."
                </p>
                <p className="text-sm mt-2 text-right text-primary-foreground/80">— Mahatma Gandhi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Background abstract elements */}
        <div className="absolute top-0 right-0 left-0 bottom-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/30 filter blur-3xl animate-float"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-blue-300/30 filter blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-8 animate-fade-in">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          </div>
          
          {children}
          
          <div className="mt-6 text-center text-sm">
            {type === "login" ? (
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline transition-all">
                  Register here
                </Link>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline transition-all">
                  Login here
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
