
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft,
  Heart,
  Share,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

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
  requirements?: string[];
  contactPerson?: string;
  contactEmail?: string;
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    // For this demo, we'll use mock data
    const fetchEvent = () => {
      setLoading(true);
      
      // Mock event data - in a real app, you would fetch this from an API
      const eventsData: Event[] = [
        {
          id: 1,
          title: "Beach Cleanup",
          organization: "Ocean Conservancy",
          date: "August 15, 2023",
          time: "9:00 AM - 12:00 PM",
          location: "Venice Beach, CA",
          participants: 24,
          status: "upcoming",
          description: "Join us for a beach cleanup event to help preserve our coastal ecosystems. We'll provide all necessary equipment including gloves, garbage bags, and tools for collecting trash. This event is suitable for volunteers of all ages and abilities.\n\nOur goal is to remove harmful debris from the beach and prevent it from entering the ocean where it can harm marine life. Not only will you be helping the environment, but you'll also enjoy a beautiful day at the beach with like-minded volunteers.\n\nWater and snacks will be provided. Please wear comfortable clothing, a hat, and sunscreen.",
          image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?q=80&w=800",
          requirements: ["Comfortable clothing", "Sunscreen", "Water bottle", "Positive attitude"],
          contactPerson: "Jane Smith",
          contactEmail: "jane@oceanconservancy.org"
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
          description: "Help collect and distribute food to families in need. This food drive aims to support local families facing food insecurity. Volunteers will help sort donations, pack food boxes, and assist with distribution.\n\nYour contribution will directly impact families in our community who are struggling to put food on the table. The food bank serves over 500 families each month, and we rely heavily on volunteers like you to make our operation possible.\n\nNo experience necessary - we'll provide all training on-site. Please wear closed-toe shoes and comfortable clothing.",
          image: "https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a4?q=80&w=800",
          requirements: ["Closed-toe shoes", "Ability to lift 10-15 pounds", "Comfortable clothing"],
          contactPerson: "Robert Johnson",
          contactEmail: "robert@localfoodbank.org"
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
          description: "Join us in building homes for families in need. No construction experience required - our team leaders will guide you through the process. This is a great opportunity to learn new skills while making a significant impact in your community.\n\nWe're currently working on a project to build 10 new affordable homes for low-income families. Each day of volunteer work brings these families closer to having a safe, decent place to live. You'll be working alongside other volunteers and possibly even the future homeowners themselves.\n\nLunch and refreshments will be provided. Please wear sturdy shoes and clothes you don't mind getting dirty.",
          image: "https://images.unsplash.com/photo-1503387837-b154d5074bd2?q=80&w=800",
          requirements: ["Sturdy closed-toe shoes", "Work gloves (if you have them)", "Sunscreen", "Water bottle"],
          contactPerson: "Michael Brown",
          contactEmail: "michael@habitat.org"
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
          description: "Help restore and beautify our local park. Activities include planting trees, cleaning up litter, and restoring pathways. This volunteer opportunity is perfect for nature lovers and those who want to improve public spaces.\n\nOur city parks are vital green spaces that provide recreation, beauty, and environmental benefits to our community. Your efforts will help ensure these spaces remain vibrant and welcoming for all residents to enjoy.\n\nGardening tools and materials will be provided. Please dress for the weather and bring work gloves if you have them.",
          image: "https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?q=80&w=800",
          requirements: ["Weather-appropriate clothing", "Work gloves (if possible)", "Water bottle", "Sunscreen"],
          contactPerson: "Sarah Williams",
          contactEmail: "sarah@cityparks.org"
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
          description: "Spend time with seniors at our local care center. Activities include playing games, reading books, and simply providing companionship. This is a rewarding opportunity to connect with older members of our community.\n\nMany seniors in care facilities experience loneliness and isolation. Your presence and conversation can brighten their day significantly and improve their quality of life. Whether you're playing chess, sharing stories, or just sitting and talking, you'll be making a meaningful difference.\n\nNo special skills required - just a friendly attitude and willingness to engage with seniors.",
          image: "https://images.unsplash.com/photo-1573497491765-55d5bce444b3?q=80&w=800",
          requirements: ["Patience and empathy", "Willingness to engage in conversation", "Background check (will be conducted prior to event)"],
          contactPerson: "David Clark",
          contactEmail: "david@eldercare.org"
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
          description: "Help care for animals at our local shelter. Tasks include walking dogs, socializing with cats, cleaning enclosures, and assisting with feeding. This is perfect for animal lovers looking to make a difference.\n\nOur shelter houses over 100 animals at any given time, all waiting for their forever homes. Your help ensures these animals receive the care, exercise, and socialization they need while they wait for adoption.\n\nTraining will be provided on-site. Please wear clothes you don't mind getting dirty and closed-toe shoes.",
          image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800",
          requirements: ["Love of animals", "Closed-toe shoes", "Comfortable clothing that can get dirty"],
          contactPerson: "Lisa Thompson",
          contactEmail: "lisa@animalservices.org"
        }
      ];
      
      const foundEvent = eventsData.find(e => e.id === parseInt(id as string));
      
      if (foundEvent) {
        setEvent(foundEvent);
      }
      
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  const handleRegister = () => {
    toast({
      title: "Registration Successful!",
      description: `You've registered for ${event?.title}. Check your email for details.`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Event link has been copied to clipboard.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Event Saved!",
      description: "This event has been added to your saved events.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/events")}>Back to Events</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with event image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute top-4 left-4 z-10">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/events")}
            className="bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </div>

      {/* Event details */}
      <div className="container max-w-4xl px-4 -mt-20 relative z-10">
        <Card className="border shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <Badge variant="outline" className="mb-2">
                  {event.status === "upcoming" ? "Upcoming" : event.status}
                </Badge>
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <p className="text-muted-foreground mt-1">Organized by {event.organization}</p>
              </div>
              
              <div className="flex gap-2 md:self-start">
                <Button variant="outline" size="icon" onClick={handleSave}>
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">About This Event</h2>
              <div className="text-muted-foreground whitespace-pre-line">
                {event.description}
              </div>
            </div>

            {event.requirements && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">What You'll Need</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {event.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Current Participation</h2>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>{event.participants} volunteers registered</span>
              </div>
            </div>

            {(event.contactPerson || event.contactEmail) && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
                {event.contactPerson && <p>Contact: {event.contactPerson}</p>}
                {event.contactEmail && (
                  <a 
                    href={`mailto:${event.contactEmail}`} 
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {event.contactEmail}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end">
              <Button variant="outline" onClick={() => navigate("/events")}>
                Back to Events
              </Button>
              <Button onClick={handleRegister}>
                Register for This Event
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
