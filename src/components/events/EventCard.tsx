
import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Event {
  id: number;
  title: string;
  organization: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  status: string;
  description: string;
  image: string;
}

interface EventCardProps {
  event: Event;
  isNew?: boolean;
}

export default function EventCard({ event, isNew = false }: EventCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 ${
      isNew ? 'animate-pulse border-primary' : ''
    }`}>
      <div className="md:flex">
        <div className="md:w-1/3 h-48 md:h-auto relative">
          <img 
            src={event.image || "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974"} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {isNew && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
              New!
            </Badge>
          )}
        </div>
        
        <div className="md:w-2/3 p-0">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription className="text-md">{event.organization}</CardDescription>
              </div>
              <Badge variant="outline" className={
                event.status === "upcoming" ? "bg-blue-50 text-blue-700 border-blue-200" :
                event.status === "active" ? "bg-green-50 text-green-700 border-green-200" :
                "bg-gray-50 text-gray-700 border-gray-200"
              }>
                {event.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {event.description}
            </p>
            
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="flex items-center text-sm">
                <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>{event.date}</span>
                {event.time && <span className="ml-1">• {event.time}</span>}
              </div>
              
              <div className="flex items-center text-sm">
                <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>{event.participants} volunteers</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full sm:w-auto" 
              onClick={() => navigate(`/events/${event.id}`)}
            >
              View Details
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
