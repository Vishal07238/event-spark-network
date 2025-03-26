import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Award, Calendar, CheckCircle, Clock, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VolunteerProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [skillInput, setSkillInput] = useState(false);
  const [interestInput, setInterestInput] = useState(false);
  
  // Mock volunteer data with state to allow updates
  const [volunteerData, setVolunteerData] = useState({
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
    history: [
      { id: 1, activity: "Beach Cleanup", date: "August 15, 2023", description: "Helped collect 50 pounds of trash from the local beach.", hours: 3 },
      { id: 2, activity: "Food Drive", date: "July 20, 2023", description: "Assisted in sorting and distributing food packages to 30 families.", hours: 4 },
      { id: 3, activity: "Animal Shelter Support", date: "June 5, 2023", description: "Walked dogs and helped clean animal enclosures.", hours: 3.5 }
    ],
    stats: {
      eventsAttended: 12,
      totalHours: 87,
      tasksCompleted: 45
    }
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const updatedData = {
        ...volunteerData,
        skills: [...volunteerData.skills, newSkill.trim()],
        history: [
          {
            id: Date.now(),
            activity: "Added New Skill",
            date: new Date().toLocaleDateString(),
            description: `Added ${newSkill.trim()} to skills list.`,
            hours: 0
          },
          ...volunteerData.history
        ]
      };
      
      setVolunteerData(updatedData);
      setNewSkill("");
      setSkillInput(false);
      
      toast({
        title: "Skill added",
        description: `"${newSkill.trim()}" has been added to your skills.`,
      });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedData = {
      ...volunteerData,
      skills: volunteerData.skills.filter(skill => skill !== skillToRemove),
      history: [
        {
          id: Date.now(),
          activity: "Removed Skill",
          date: new Date().toLocaleDateString(),
          description: `Removed ${skillToRemove} from skills list.`,
          hours: 0
        },
        ...volunteerData.history
      ]
    };
    
    setVolunteerData(updatedData);
    
    toast({
      title: "Skill removed",
      description: `"${skillToRemove}" has been removed from your skills.`,
    });
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      const updatedData = {
        ...volunteerData,
        interests: [...volunteerData.interests, newInterest.trim()],
        history: [
          {
            id: Date.now(),
            activity: "Added New Interest",
            date: new Date().toLocaleDateString(),
            description: `Added ${newInterest.trim()} to interests list.`,
            hours: 0
          },
          ...volunteerData.history
        ]
      };
      
      setVolunteerData(updatedData);
      setNewInterest("");
      setInterestInput(false);
      
      toast({
        title: "Interest added",
        description: `"${newInterest.trim()}" has been added to your interests.`,
      });
    }
  };

  const removeInterest = (interestToRemove: string) => {
    const updatedData = {
      ...volunteerData,
      interests: volunteerData.interests.filter(interest => interest !== interestToRemove),
      history: [
        {
          id: Date.now(),
          activity: "Removed Interest",
          date: new Date().toLocaleDateString(),
          description: `Removed ${interestToRemove} from interests list.`,
          hours: 0
        },
        ...volunteerData.history
      ]
    };
    
    setVolunteerData(updatedData);
    
    toast({
      title: "Interest removed",
      description: `"${interestToRemove}" has been removed from your interests.`,
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
                        <Badge key={index} variant="outline" className="py-1.5 pr-1.5 pl-3">
                          {skill}
                          <button 
                            onClick={() => removeSkill(skill)}
                            className="ml-1 rounded-full hover:bg-muted p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      
                      {skillInput ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Enter skill..."
                            className="w-40 h-8"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addSkill();
                              }
                            }}
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={addSkill}
                          >
                            Add
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setSkillInput(false);
                              setNewSkill("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => setSkillInput(true)}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Skill</span>
                        </Button>
                      )}
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
                        <Badge key={index} variant="outline" className="py-1.5 pr-1.5 pl-3">
                          {interest}
                          <button 
                            onClick={() => removeInterest(interest)}
                            className="ml-1 rounded-full hover:bg-muted p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      
                      {interestInput ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            placeholder="Enter interest..."
                            className="w-40 h-8"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addInterest();
                              }
                            }}
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={addInterest}
                          >
                            Add
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setInterestInput(false);
                              setNewInterest("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => setInterestInput(true)}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Interest</span>
                        </Button>
                      )}
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
                        {volunteerData.history.map((item) => (
                          <div key={item.id} className="relative">
                            <div className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-primary"></div>
                            <div className="space-y-1">
                              <h4 className="font-medium">
                                {item.activity}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {item.date}
                              </p>
                              <p className="text-sm">
                                {item.description}
                              </p>
                              {item.hours > 0 && (
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <Clock className="mr-1 h-4 w-4" />
                                  <span>{item.hours} hours</span>
                                </div>
                              )}
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
