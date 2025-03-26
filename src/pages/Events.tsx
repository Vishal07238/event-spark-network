
import { useState } from "react";
import EventsHeader from "@/components/events/EventsHeader";
import EventsList from "@/components/events/EventsList";
import SearchFilter from "@/components/events/SearchFilter";
import EventsPagination from "@/components/events/EventsPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useRealTimeEvents } from "@/hooks/useRealTimeEvents";

export default function Events() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const eventsPerPage = 5;
  
  const { 
    events, 
    isLoading, 
    isRealtimeEnabled,
    toggleRealtime,
    realtimeStatus
  } = useRealTimeEvents({ enabled: true });
  
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
