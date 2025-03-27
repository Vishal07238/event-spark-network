
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, MapPin, Users, Calendar, Clock, ArrowRight, CircleCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
  isNew?: boolean;
}

const EventCard = ({ event, isNew = false }: EventCardProps) => {
  // Format the date to be more user-friendly
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Determine status color
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'filled':
        return 'bg-amber-100 text-amber-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${isNew ? 'border-primary' : ''}`}>
      <div className="md:flex">
        <div className="md:w-1/3 bg-gray-200 min-h-[140px] md:min-h-full relative">
          {isNew && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 z-10"
            >
              <Badge className="bg-primary">New</Badge>
            </motion.div>
          )}
          <img 
            src={event.image || "/placeholder.svg"} 
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="md:w-2/3">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-2">
              <div>
                <CardTitle className="text-xl mb-1">{event.title}</CardTitle>
                <CardDescription className="font-medium">
                  {event.organization}
                </CardDescription>
              </div>
              <Badge 
                className={`${getStatusColor(event.status)}`}
                aria-label={`Event status: ${event.status}`}
              >
                {event.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="py-2">
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
              {event.description}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
              <div className="flex items-center" aria-label="Event date">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center" aria-label="Event time">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center" aria-label="Event location">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center" aria-label={`${event.participants} participants`}>
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{event.participants} participants</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="pt-2 flex justify-end">
            <Button asChild size="sm">
              <Link 
                to={`/events/${event.id}`}
                className="flex items-center gap-1"
                aria-label={`View details for ${event.title}`}
              >
                View details
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
