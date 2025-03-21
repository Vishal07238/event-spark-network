
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, Users, Activity, Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Index() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading state for animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-multiply" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="container max-w-6xl relative z-10">
          <div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center">
            <div className={`flex flex-col space-y-4 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80 w-fit">
                Join 5,000+ volunteers worldwide
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Make a real <span className="text-primary">impact</span> in your community
              </h1>
              <p className="text-xl text-muted-foreground max-w-md">
                Connect with meaningful volunteer opportunities and NGOs that match your skills and passion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/register")}
                  className="group"
                >
                  Get Started 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
              </div>
            </div>
            
            <div className={`relative transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="relative mx-auto w-full max-w-md">
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border backdrop-blur-sm">
                  <div className="px-8 pt-8 pb-6">
                    <h3 className="text-lg font-semibold mb-3">Upcoming Events</h3>
                    <div className="space-y-4">
                      {[
                        { 
                          title: "Beach Cleanup", 
                          location: "Venice Beach, CA", 
                          date: "August 15, 2023",
                          icon: "🌊"
                        },
                        { 
                          title: "Food Drive", 
                          location: "Downtown Food Bank", 
                          date: "August 20, 2023",
                          icon: "🍎" 
                        },
                        { 
                          title: "Habitat Building", 
                          location: "Westside Community", 
                          date: "August 27, 2023",
                          icon: "🏗️" 
                        }
                      ].map((event, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-lg border bg-white/5 backdrop-blur-sm hover:bg-accent transition-all cursor-pointer animate-fade-in`}
                          style={{ animationDelay: `${index * 200}ms` }}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                              <span className="text-lg">{event.icon}</span>
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-medium">{event.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
                              <p className="text-xs text-muted-foreground">{event.date}</p>
                            </div>
                            <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground/50" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-8 py-4 bg-accent/50 border-t">
                    <Button variant="ghost" size="sm" className="w-full justify-between" onClick={() => navigate("/events")}>
                      View all events
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-primary/30 blur-xl" />
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-500/30 blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container max-w-6xl">
          <div className={`text-center max-w-2xl mx-auto mb-12 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Join VolunteerHub?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Connect with meaningful opportunities and make a real difference in communities that need your help.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Find Events",
                description: "Discover volunteer opportunities that match your skills and interests.",
                icon: Calendar,
                delay: 100
              },
              {
                title: "Connect with NGOs",
                description: "Build relationships with organizations making real impact.",
                icon: Users,
                delay: 200
              },
              {
                title: "Track Progress",
                description: "Monitor your volunteer hours and contributions over time.",
                icon: Activity,
                delay: 300
              },
              {
                title: "Make Impact",
                description: "See the tangible difference your volunteering makes.",
                icon: Heart,
                delay: 400
              }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className={`transition-all duration-700 animate-fade-in hover:shadow-md transition-shadow`}
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 md:py-24 px-4 bg-accent">
        <div className="container max-w-6xl text-center">
          <div className={`max-w-2xl mx-auto transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to make a difference?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of volunteers who are creating positive change around the world.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/register")}
                className="group"
              >
                Get Started 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/login")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">VolunteerHub</h3>
              <p className="text-sm text-muted-foreground">
                Connecting volunteers with meaningful opportunities since 2023.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Events</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Organizations</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Instagram</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Facebook</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t text-sm text-center text-muted-foreground">
            <p>© 2023 VolunteerHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
