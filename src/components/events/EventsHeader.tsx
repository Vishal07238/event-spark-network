
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventsHeader() {
  const navigate = useNavigate();
  
  return (
    <header className="bg-accent py-8">
      <div className="container max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-bold">Volunteer Events</h1>
        <p className="text-muted-foreground mt-2">
          Find opportunities to make a difference in your community
        </p>
      </div>
    </header>
  );
}
