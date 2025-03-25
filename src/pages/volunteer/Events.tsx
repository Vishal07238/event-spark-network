
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Users, Clock, Search, Filter, X, Calendar as CalendarIcon } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useEvents } from "@/hooks/useEvents";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function VolunteerEvents() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState("");
  
  const { 
    events, 
    isLoading, 
    error, 
    filters, 
    updateFilters, 
    resetFilters 
  } = useEvents({ search: "" });
  
  // Function to handle search
  const handleSearch = (searchTerm: string) => {
    updateFilters({ search: searchTerm });
  };
  
  // Function to handle filters
  const applyFilters = () => {
    updateFilters({
      location: location || undefined,
      dateRange: date ? { from: date, to: undefined } : undefined
    });
    setShowFilters(false);
  };
  
  // Function to clear filters
  const clearFilters = () => {
    setLocation("");
    setDate(undefined);
    resetFilters();
    setShowFilters(false);
  };
  
  // Handle registering for an event
  const handleRegisterForEvent = (eventId: number) => {
    toast({
      title: "Registration pending",
      description: "Your registration is being processed...",
    });
    
    // Show success toast after a delay (simulating API call)
    setTimeout(() => {
      toast({
        title: "Registration successful!",
        description: "You have successfully registered for this event.",
      });
    }, 1500);
  };

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
        
        {/* Search and filters */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-10"
              value={filters.search || ""}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={showFilters ? "secondary" : "outline"} 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            {(filters.location || filters.dateRange?.from) && (
              <Button variant="ghost" size="icon" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Filter options */}
        {showFilters && (
          <div className="rounded-lg border p-4 shadow-sm bg-card">
            <h3 className="mb-4 font-medium">Filter Options</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <Input
                  id="location"
                  placeholder="Filter by location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={!date ? "text-muted-foreground" : ""}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={clearFilters}>Clear</Button>
                <Button onClick={applyFilters}>Apply Filters</Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video w-full">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader className="p-4 pb-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">Failed to load events. Please try again later.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">No events found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                    <Badge variant="outline" className={
                      event.status === "upcoming" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      event.status === "active" ? "bg-green-50 text-green-700 border-green-200" :
                      "bg-gray-50 text-gray-700 border-gray-200"
                    }>
                      {event.status}
                    </Badge>
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
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View Details
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={() => handleRegisterForEvent(event.id)}
                  >
                    Register
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
