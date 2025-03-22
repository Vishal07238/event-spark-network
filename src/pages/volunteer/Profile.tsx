
import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Award, Calendar, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VolunteerProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock volunteer data
  const volunteerData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "Los Angeles, CA",
    bio: "Passionate about environmental conservation and community service. I have been volunteering for various causes for over 5 years.",
    skills: ["Event Coordination", "First Aid", "Social Media", "Photography", "Teaching"],
    interests: ["Environment", "Education", "Animal Welfare", "Community Development"],
    achievements: [
      { id: 1, title: "100 Volunteer Hours", description: "Completed 100 hours of community service", date: "June 2023" },
      { id: 2, title: "Team Leader", description: "Led a team of 10 volunteers for beach cleanup", date: "July 2023" },
      { id: 3, title: "Special Recognition", description: "Received special recognition for outstanding contribution", date: "August 2023" }
    ],
    stats: {
      eventsAttended: 12,
      totalHours: 87,
      tasksCompleted: 45
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  return (
    <DashboardLayout userType="volunteer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and volunteer preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main content - 2/3 width on desktop */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="skills">Skills & Interests</TabsTrigger>
                <TabsTrigger value="history">Volunteer History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          defaultValue={volunteerData.name} 
                          disabled={!isEditing} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          defaultValue={volunteerData.email} 
                          disabled={!isEditing} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          defaultValue={volunteerData.phone} 
                          disabled={!isEditing} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          defaultValue={volunteerData.location} 
                          disabled={!isEditing} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea 
                        id="bio" 
                        className="w-full min-h-24 p-3 rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue={volunteerData.bio}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    )}
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences and security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="password" 
                          type="password" 
                          value="••••••••" 
                          disabled 
                        />
                        <Button variant="outline">Change</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notifications">Notification Preferences</Label>
                      <div className="flex gap-2">
                        <Button variant="outline">Manage Notifications</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="skills" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription>
                      Add the skills you can contribute as a volunteer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {volunteerData.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="py-1.5">
                          {skill}
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Add Skill</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Interests</CardTitle>
                    <CardDescription>
                      Select your volunteer interests to find matching opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {volunteerData.interests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="py-1.5">
                          {interest}
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Add Interest</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Volunteer History</CardTitle>
                    <CardDescription>
                      Your past volunteer activities and contributions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="border-l-2 border-muted pl-4 space-y-6">
                        {[...Array(3)].map((_, index) => (
                          <div key={index} className="relative">
                            <div className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-primary"></div>
                            <div className="space-y-1">
                              <h4 className="font-medium">
                                {index === 0 ? "Beach Cleanup" : index === 1 ? "Food Drive" : "Animal Shelter Support"}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {index === 0 ? "August 15, 2023" : index === 1 ? "July 20, 2023" : "June 5, 2023"}
                              </p>
                              <p className="text-sm">
                                {index === 0 
                                  ? "Helped collect 50 pounds of trash from the local beach." 
                                  : index === 1 
                                    ? "Assisted in sorting and distributing food packages to 30 families." 
                                    : "Walked dogs and helped clean animal enclosures."}
                              </p>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Clock className="mr-1 h-4 w-4" />
                                <span>{index === 0 ? "3 hours" : index === 1 ? "4 hours" : "3.5 hours"}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>
                      Recognitions and milestones in your volunteer journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {volunteerData.achievements.map((achievement) => (
                        <div key={achievement.id} className="flex items-start gap-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Award className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>{achievement.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar - 1/3 width on desktop */}
          <div>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder.svg" alt={volunteerData.name} />
                    <AvatarFallback className="text-2xl">JD</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{volunteerData.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{volunteerData.location}</p>
                  <Badge variant="outline">Volunteer</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center mb-6">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{volunteerData.stats.eventsAttended}</p>
                    <p className="text-xs text-muted-foreground">Events</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{volunteerData.stats.totalHours}</p>
                    <p className="text-xs text-muted-foreground">Hours</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{volunteerData.stats.tasksCompleted}</p>
                    <p className="text-xs text-muted-foreground">Tasks</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Profile Complete</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Email Verified</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Phone Verified</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Download Certificate</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
