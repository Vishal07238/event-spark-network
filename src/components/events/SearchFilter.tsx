
import { Search, Filter, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  locationFilter?: string;
  onSearchChange?: (query: string) => void;
  onLocationChange?: (location: string) => void;
}

export default function SearchFilter({ 
  searchQuery, 
  setSearchQuery,
  locationFilter,
  onSearchChange,
  onLocationChange
}: SearchFilterProps) {
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Use the appropriate handler based on what's provided
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setSearchQuery(value);
    }
  };

  return (
    <div className="bg-accent/50 py-4 border-y">
      <div className="container max-w-6xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, organization or location"
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
