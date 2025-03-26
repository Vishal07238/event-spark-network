
import { useState, useEffect } from "react";
import EventsHeader from "@/components/events/EventsHeader";
import EventsList from "@/components/events/EventsList";
import SearchFilter from "@/components/events/SearchFilter";
import EventsPagination from "@/components/events/EventsPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useRealTimeEvents } from "@/hooks/useRealTimeEvents";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Events() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const eventsPerPage = 5;
  
  const { 
    events, 
    isLoading, 
    isRealtimeEnabled,
    toggleRealtime,
    realtimeStatus,
    forceReconnect,
    refetch,
    lastUpdate
  } = useRealTimeEvents({ enabled: true });
  
  // Display last update time
  useEffect(() => {
    if (lastUpdate) {
      const timeString = lastUpdate.toLocaleTimeString();
      console.log(`Events last updated at: ${timeString}`);
    }
  }, [lastUpdate]);
  
  // Filter events based on search query and location
  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = !locationFilter || 
      event.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });
  
  // Calculate pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
  // Handle location filter
  const handleLocationFilter = (location: string) => {
    setLocationFilter(location);
    setCurrentPage(1);
  };
  
  // Handle manual refresh with loading state
  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing events:", error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <EventsHeader 
        realtimeEnabled={isRealtimeEnabled}
        toggleRealtime={toggleRealtime}
        realtimeStatus={realtimeStatus}
      />
      
      <main className="flex-1 container max-w-6xl py-8">
        <div className="mb-8">
          <SearchFilter 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            locationFilter={locationFilter}
            onSearchChange={handleSearch}
            onLocationChange={handleLocationFilter}
          />
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
            </h2>
            {lastUpdate && (
              <p className="text-sm text-muted-foreground">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManualRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-32 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <EventsList 
              filteredEvents={currentEvents} 
              isRealtimeEnabled={isRealtimeEnabled}
            />
            
            {totalPages > 1 && (
              <div className="mt-8">
                <EventsPagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
