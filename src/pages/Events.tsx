
import { useState } from "react";
import EventsHeader from "@/components/events/EventsHeader";
import SearchFilter from "@/components/events/SearchFilter";
import EventsList from "@/components/events/EventsList";
import EventsPagination from "@/components/events/EventsPagination";

export default function Events() {
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
      <EventsHeader />
      <SearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="container max-w-6xl py-8">
        <EventsList filteredEvents={filteredEvents} />
        <EventsPagination />
      </div>
    </div>
  );
}
