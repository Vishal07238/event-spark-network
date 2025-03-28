
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  progress?: number;
  loading?: boolean;
}

export default function StatsCard({ 
  title, 
  value, 
  description, 
  icon, 
  progress, 
  loading = false 
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? "..." : value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {progress !== undefined && (
          <Progress
            value={progress}
            className="h-2 mt-2"
            aria-label={`${title} progress`}
          />
        )}
      </CardContent>
    </Card>
  );
}
