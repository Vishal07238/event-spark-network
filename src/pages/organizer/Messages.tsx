
import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Send, UserCircle, Search } from "lucide-react";
import { useMessaging } from "@/hooks/useMessaging";
import { getAllVolunteers } from "@/utils/auth";
import { User } from "@/types/auth";

export default function OrganizerMessages() {
  const { state } = useAuth();
  const { messages, loading, sendMessage, getThreads, refreshMessages } = useMessaging();
  const [volunteers, setVolunteers] = useState<User[]>([]);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessageDialogOpen, setNewMessageDialogOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);
  const [subject, setSubject] = useState("");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("inbox");

  // Get all threads
  const threads = getThreads();
  
  // Filter threads by search query
  const filteredThreads = threads.filter(thread => {
    const otherParticipantId = thread.participants.find(id => id !== state.user?.id);
    const otherParticipantName = otherParticipantId ? thread.participantNames[otherParticipantId] : "";
    return otherParticipantName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get messages for selected thread
  const threadMessages = selectedThread ? 
    messages.filter(msg => 
      (msg.senderId === state.user?.id && msg.recipientId === threads.find(t => t.id === selectedThread)?.participants.find(id => id !== state.user?.id)) || 
      (msg.recipientId === state.user?.id && msg.senderId === threads.find(t => t.id === selectedThread)?.participants.find(id => id !== state.user?.id))
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) 
    : [];

  // Load volunteers
  useEffect(() => {
    const loadVolunteers = () => {
      try {
        const allVolunteers = getAllVolunteers();
        setVolunteers(allVolunteers);
      } catch (error) {
        console.error("Error loading volunteers:", error);
      }
    };
    
    loadVolunteers();
  }, []);

  // Handle sending a message in an existing thread
  const handleSendMessage = () => {
    if (!messageContent.trim()) return;
    
    if (!selectedThread) {
      toast({
        title: "No conversation selected",
        description: "Please select a conversation first.",
        variant: "destructive",
      });
      return;
    }
    
    const thread = threads.find(t => t.id === selectedThread);
    if (!thread) return;
    
    const recipientId = thread.participants.find(id => id !== state.user?.id);
    if (!recipientId) return;
    
    const recipientName = thread.participantNames[recipientId] || "Volunteer";
    
    sendMessage(recipientId, recipientName, messageContent);
    setMessageContent("");
  };

  // Handle starting a new conversation
  const handleStartNewConversation = () => {
    if (!selectedRecipient) {
      toast({
        title: "No recipient selected",
        description: "Please select a recipient for your message.",
        variant: "destructive",
      });
      return;
    }
    
    if (!messageContent.trim()) {
      toast({
        title: "Message is empty",
        description: "Please enter a message.",
        variant: "destructive",
      });
      return;
    }
    
    sendMessage(selectedRecipient.id, selectedRecipient.name, messageContent, subject);
    setMessageContent("");
    setSubject("");
    setSelectedRecipient(null);
    setNewMessageDialogOpen(false);
    
    // Refresh messages to get the new thread
    setTimeout(() => {
      refreshMessages();
    }, 500);
  };

  // Filtered volunteers for new message dialog
  const filteredVolunteers = volunteers.filter(volunteer => 
    volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout userType="organizer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground">
              Communicate with volunteers and other organizers
            </p>
          </div>
          <Button onClick={() => setNewMessageDialogOpen(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-72 grid-cols-2">
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>
          
          <div className="flex h-[600px] mt-4 border rounded-md">
            {/* Conversations list */}
            <div className="w-1/3 border-r overflow-auto">
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="divide-y">
                {loading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading conversations...
                  </div>
                ) : filteredThreads.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No conversations found.
                  </div>
                ) : (
                  filteredThreads
                    .filter(thread => {
                      if (activeTab === "inbox") {
                        return thread.messages.some(msg => msg.recipientId === state.user?.id);
                      } else {
                        return thread.messages.some(msg => msg.senderId === state.user?.id);
                      }
                    })
                    .map(thread => {
                      const otherParticipantId = thread.participants.find(id => id !== state.user?.id);
                      const otherParticipantName = otherParticipantId ? thread.participantNames[otherParticipantId] : "Unknown";
                      const lastMessage = thread.messages[thread.messages.length - 1];
                      const isSelected = selectedThread === thread.id;
                      
                      return (
                        <div
                          key={thread.id}
                          className={`p-3 hover:bg-muted cursor-pointer ${isSelected ? 'bg-muted' : ''}`}
                          onClick={() => setSelectedThread(thread.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {otherParticipantName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium truncate">{otherParticipantName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(lastMessage.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {lastMessage.content.substring(0, 40)}{lastMessage.content.length > 40 ? '...' : ''}
                              </p>
                              {thread.unreadCount > 0 && activeTab === "inbox" && (
                                <Badge variant="default" className="mt-1">
                                  {thread.unreadCount} new
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
            
            {/* Message content */}
            <div className="flex-1 flex flex-col">
              {selectedThread ? (
                <>
                  {/* Conversation header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {(() => {
                            const thread = threads.find(t => t.id === selectedThread);
                            if (!thread) return "??";
                            const otherParticipantId = thread.participants.find(id => id !== state.user?.id);
                            const otherParticipantName = otherParticipantId ? thread.participantNames[otherParticipantId] : "Unknown";
                            return otherParticipantName.substring(0, 2).toUpperCase();
                          })()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {(() => {
                            const thread = threads.find(t => t.id === selectedThread);
                            if (!thread) return "Unknown Contact";
                            const otherParticipantId = thread.participants.find(id => id !== state.user?.id);
                            return otherParticipantId ? thread.participantNames[otherParticipantId] : "Unknown";
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-auto space-y-4">
                    {threadMessages.map((msg, index) => {
                      const isFromMe = msg.senderId === state.user?.id;
                      return (
                        <div key={index} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] px-4 py-2 rounded-lg ${isFromMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            {msg.subject && <p className="font-semibold mb-1">{msg.subject}</p>}
                            <p>{msg.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Message input */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div>
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No conversation selected</h3>
                    <p className="text-muted-foreground mt-2">
                      Select a conversation from the list or start a new one.
                    </p>
                    <Button 
                      className="mt-4" 
                      variant="outline" 
                      onClick={() => setNewMessageDialogOpen(true)}
                    >
                      Start new conversation
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </div>
      
      {/* New message dialog */}
      <Dialog open={newMessageDialogOpen} onOpenChange={setNewMessageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient</label>
              <div className="relative">
                <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search volunteers..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="h-40 overflow-y-auto border rounded-md mt-2">
                {filteredVolunteers.length === 0 ? (
                  <div className="p-3 text-center text-muted-foreground">
                    No volunteers found
                  </div>
                ) : (
                  filteredVolunteers.map(volunteer => (
                    <div
                      key={volunteer.id}
                      className={`p-3 flex items-center space-x-3 hover:bg-muted cursor-pointer ${selectedRecipient?.id === volunteer.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedRecipient(volunteer)}
                    >
                      <UserCircle className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{volunteer.name}</p>
                        <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject (Optional)</label>
              <Input
                placeholder="Message subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Type your message here..."
                rows={4}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStartNewConversation}>
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
