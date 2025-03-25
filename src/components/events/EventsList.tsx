
import EventCard from "./EventCard";

interface EventsListProps {
  filteredEvents: Array<{
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
  }>;
}

export default function EventsList({ filteredEvents }: EventsListProps) {
  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No events found matching your search criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-6">
      {filteredEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
