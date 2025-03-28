
import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useVolunteers } from "@/hooks/useVolunteers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Calendar, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/hooks/useMessaging";

export default function OrganizerVolunteers() {
  const { state } = useAuth();
  const { volunteers, loading } = useVolunteers();
  const { sendMessage } = useMessaging();
  const [selectedVolunteer, setSelectedVolunteer] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState("");

  const handleSendMessage = async (volunteerId: string, volunteerName: string) => {
    if (!state.user) return;
    
    const message = await sendMessage(
      volunteerId, 
      volunteerName, 
      messageContent,
      "Message from Organizer"
    );
    
    if (message) {
      setMessageContent("");
      setSelectedVolunteer(null);
    }
  };

  return (
    <DashboardLayout userType="organizer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Manage Volunteers</h1>
            <p className="text-muted-foreground">
              View and interact with volunteers registered on the platform
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registered Volunteers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : volunteers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers.map((volunteer) => (
                    <TableRow key={volunteer.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {volunteer.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {volunteer.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(volunteer.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedVolunteer(selectedVolunteer === volunteer.id ? null : volunteer.id)}
                          >
                            Message
                          </Button>
                          <Button variant="outline" size="sm">Assign Task</Button>
                        </div>
                        
                        {selectedVolunteer === volunteer.id && (
                          <div className="mt-2 p-2 border rounded-md">
                            <textarea 
                              className="w-full p-2 border rounded-md mb-2"
                              placeholder="Type your message here..." 
                              rows={3}
                              value={messageContent}
                              onChange={(e) => setMessageContent(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setSelectedVolunteer(null)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleSendMessage(volunteer.id, volunteer.name)}
                              >
                                Send
                              </Button>
                            </div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No volunteers registered yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
