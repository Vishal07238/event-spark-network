
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function VolunteerEvents() {
  const navigate = useNavigate();
  
  // Mock events data
  const events = [
    {
      id: 1,
      title: "Beach Cleanup",
      organization: "Ocean Conservancy",
      date: "August 15, 2023",
      time: "9:00 AM - 12:00 PM",
      location: "Venice Beach, CA",
      participants: 24,
      status: "upcoming",
      description: "Join us for a beach cleanup event to help preserve our coastal ecosystems.",
      image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?q=80&w=300"
    },
    {
      id: 2,
      title: "Food Drive",
      organization: "Local Food Bank",
      date: "August 20, 2023",
      time: "1:00 PM - 4:00 PM",
      location: "Downtown Community Center",
      participants: 12,
      status: "upcoming",
      description: "Help collect and distribute food to families in need.",
      image: "https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a4?q=80&w=300"
    },
    {
      id: 3,
      title: "Animal Shelter Support",
      organization: "City Animal Services",
      date: "September 18, 2023",
      time: "9:00 AM - 12:00 PM",
      location: "Hope Animal Shelter",
      participants: 10,
      status: "upcoming",
      description: "Help care for animals at our local shelter.",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=300"
    }
  ];

  return (
    <DashboardLayout userType="volunteer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
            <p className="text-muted-foreground">
              Discover volunteer opportunities in your community
            </p>
          </div>
          <Button onClick={() => navigate("/events")}>View All Events</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                  <Badge variant="outline">{event.status}</Badge>
                </div>
                <CardDescription>{event.organization}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="line-clamp-2 text-sm mb-4">{event.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    <span>{event.participants} volunteers</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
