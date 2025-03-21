
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search,
  Filter,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function Events() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Events data - in a real app this would come from an API
  const eventsData = [
    {
      id: 1,
      title: "Beach Cleanup",
      organization: "Ocean Conservancy",
      date: "August 15, 2023",
      time: "9:00 AM - 12:00 PM",
      location: "Venice Beach, CA",
      participants: 24,
      status: "upcoming",
      description: "Join us for a beach cleanup event to help preserve our coastal ecosystems. We'll provide all necessary equipment including gloves, garbage bags, and tools for collecting trash. This event is suitable for volunteers of all ages and abilities.",
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
      description: "Help collect and distribute food to families in need. This food drive aims to support local families facing food insecurity. Volunteers will help sort donations, pack food boxes, and assist with distribution.",
      image: "https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a4?q=80&w=300"
    },
    {
      id: 3,
      title: "Habitat Building",
      organization: "Habitat for Humanity",
      date: "August 27, 2023",
      time: "8:00 AM - 3:00 PM",
      location: "Westside Community",
      participants: 30,
      status: "upcoming",
      description: "Join us in building homes for families in need. No construction experience required - our team leaders will guide you through the process. This is a great opportunity to learn new skills while making a significant impact in your community.",
      image: "https://images.unsplash.com/photo-1503387837-b154d5074bd2?q=80&w=300"
    },
    {
      id: 4,
      title: "Park Restoration",
      organization: "City Parks Department",
      date: "September 5, 2023",
      time: "10:00 AM - 2:00 PM",
      location: "Central Park",
      participants: 15,
      status: "upcoming",
      description: "Help restore and beautify our local park. Activities include planting trees, cleaning up litter, and restoring pathways. This volunteer opportunity is perfect for nature lovers and those who want to improve public spaces.",
      image: "https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?q=80&w=300"
    },
    {
      id: 5,
      title: "Senior Center Assistance",
      organization: "Elder Care Alliance",
      date: "September 12, 2023",
      time: "1:00 PM - 4:00 PM",
      location: "Sunshine Senior Living",
      participants: 8,
      status: "upcoming",
      description: "Spend time with seniors at our local care center. Activities include playing games, reading books, and simply providing companionship. This is a rewarding opportunity to connect with older members of our community.",
      image: "https://images.unsplash.com/photo-1573497491765-55d5bce444b3?q=80&w=300"
    },
    {
      id: 6,
      title: "Animal Shelter Support",
      organization: "City Animal Services",
      date: "September 18, 2023",
      time: "9:00 AM - 12:00 PM",
      location: "Hope Animal Shelter",
      participants: 10,
      status: "upcoming",
      description: "Help care for animals at our local shelter. Tasks include walking dogs, socializing with cats, cleaning enclosures, and assisting with feeding. This is perfect for animal lovers looking to make a difference.",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=300"
    }
  ];

  // Filter events based on search query
  const filteredEvents = eventsData.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      {/* Search and Filter */}
      <div className="bg-accent/50 py-4 border-y">
        <div className="container max-w-6xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, organization or location"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="container max-w-6xl py-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredEvents.map((event) => (
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
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
