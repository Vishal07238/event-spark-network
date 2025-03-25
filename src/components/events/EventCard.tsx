
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: {
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
  };
}

export default function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card 
      key={event.id} 
      className="overflow-hidden transition-all hover:shadow-md"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row cursor-pointer">
          <div className="sm:w-48 h-48 overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title} 
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <Badge variant="outline" className="w-fit">
                {event.status === "upcoming" ? "Upcoming" : event.status}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mt-1">{event.organization}</p>
            
            <p className="mt-3 line-clamp-2">{event.description}</p>
            
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-sm">
                <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{event.participants} volunteers</span>
              </div>
              <Button size="sm">View Details</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
