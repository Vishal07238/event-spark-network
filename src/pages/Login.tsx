
import React, { useState } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VolunteerLoginForm from "@/components/auth/VolunteerLoginForm";
import OrganizerLoginForm from "@/components/auth/OrganizerLoginForm";
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import LoginCredentialHelp from "@/components/auth/LoginCredentialHelp";
import { LoginProvider } from "@/components/auth/LoginContext";

export default function Login() {
  const [activeTab, setActiveTab] = useState("volunteer");

  // Helper text for different login types
  const helperText = {
    volunteer: "Quick login for volunteers - no password needed!",
    organizer: "Login to manage your events and volunteers",
    admin: "System administrator access"
  };

  return (
    <LoginProvider>
      <AuthLayout
        title="Welcome back"
        subtitle="Login to your VolunteerHub account"
        type="login"
      >
        <Tabs
          defaultValue="volunteer"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
            <TabsTrigger value="organizer">Organizer</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          
          <p className="text-sm text-muted-foreground mt-2 mb-6 text-center">
            {helperText[activeTab as keyof typeof helperText]}
          </p>

          <TabsContent value="volunteer">
            <VolunteerLoginForm />
          </TabsContent>
          
          <TabsContent value="organizer">
            <OrganizerLoginForm />
          </TabsContent>
          
          <TabsContent value="admin">
            <AdminLoginForm />
          </TabsContent>
        </Tabs>

        <LoginCredentialHelp />
      </AuthLayout>
    </LoginProvider>
  );
}
