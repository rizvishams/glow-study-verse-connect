
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from '@/components/DashboardSidebar';
import DigitalClock from '@/components/DigitalClock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, MessageSquare, Search, User, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import VideoConference from '@/components/VideoConference';

const Dashboard = () => {
  // Added state for video conference
  const [videoConferenceOpen, setVideoConferenceOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);

  // Mock upcoming sessions data
  const upcomingSessions = [
    {
      id: 1,
      subject: "Advanced JavaScript",
      date: "May 8, 2025",
      time: "3:00 PM",
      buddy: "Alex Johnson",
      avatar: "",
      duration: "1 hour",
      buddies: ["Alex Johnson"]
    },
    {
      id: 2,
      subject: "Data Structures",
      date: "May 10, 2025",
      time: "5:30 PM",
      buddy: "Sarah Parker",
      avatar: "",
      duration: "1.5 hours",
      buddies: ["Sarah Parker"]
    }
  ];
  
  // Mock suggested buddies
  const suggestedBuddies = [
    {
      id: 1,
      name: "Michael Lee",
      subject: "Machine Learning",
      compatibility: "95%",
      avatar: ""
    },
    {
      id: 2,
      name: "Emma Davis",
      subject: "Web Development",
      compatibility: "91%",
      avatar: ""
    },
    {
      id: 3,
      name: "James Wilson",
      subject: "Physics",
      compatibility: "87%",
      avatar: ""
    }
  ];

  const handleJoinSession = (session: any) => {
    setCurrentSession(session);
    setVideoConferenceOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        
        <div className="flex-1">
          <header className="border-b border-white/10 px-6 py-3 flex justify-between items-center bg-black/20 backdrop-blur-md">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <DigitalClock />
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-gray-300" />
              </Button>
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-neon-purple text-white">JD</AvatarFallback>
              </Avatar>
            </div>
          </header>
          
          <main className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back, John!</h1>
              <p className="text-gray-300">Here's an overview of your study plans and activities.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content - 2/3 width on large screens */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link to="/find-buddy">
                    <Card className="glass-card hover:border-neon-purple/50 transition-all">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <Search className="h-10 w-10 mb-4 text-neon-purple" />
                        <h3 className="font-medium text-white">Find Study Buddy</h3>
                        <p className="text-sm text-gray-400 mt-1">Match with compatible study partners</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link to="/scheduling">
                    <Card className="glass-card hover:border-neon-cyan/50 transition-all">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <Calendar className="h-10 w-10 mb-4 text-neon-cyan" />
                        <h3 className="font-medium text-white">Schedule Session</h3>
                        <p className="text-sm text-gray-400 mt-1">Create or join study sessions</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link to="/messages">
                    <Card className="glass-card hover:border-neon-pink/50 transition-all">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <MessageSquare className="h-10 w-10 mb-4 text-neon-pink" />
                        <h3 className="font-medium text-white">Messages</h3>
                        <p className="text-sm text-gray-400 mt-1">Chat with your study buddies</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
                
                {/* Upcoming Study Sessions */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-neon-cyan">Upcoming Study Sessions</CardTitle>
                    <CardDescription>Your scheduled learning activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingSessions.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingSessions.map(session => (
                          <div key={session.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                              <div className="bg-neon-purple/20 p-3 rounded-full">
                                <Calendar className="h-6 w-6 text-neon-purple" />
                              </div>
                              <div>
                                <h4 className="font-medium text-white">{session.subject}</h4>
                                <p className="text-sm text-gray-400">
                                  {session.date} • {session.time} • with {session.buddy}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Link to="/scheduling">
                                <Button variant="outline" size="sm" className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10">
                                  Details
                                </Button>
                              </Link>
                              <Button 
                                size="sm" 
                                className="bg-neon-purple text-white"
                                onClick={() => handleJoinSession(session)}
                              >
                                Join
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No upcoming sessions. Schedule one now!</p>
                        <Link to="/scheduling">
                          <Button className="mt-4 bg-neon-cyan text-white">
                            Schedule Session
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Study Statistics */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-neon-pink">Study Statistics</CardTitle>
                    <CardDescription>Your learning progress this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                        <h4 className="text-2xl font-bold text-neon-purple">8</h4>
                        <p className="text-sm text-gray-400">Hours Studied</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                        <h4 className="text-2xl font-bold text-neon-cyan">4</h4>
                        <p className="text-sm text-gray-400">Sessions Completed</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                        <h4 className="text-2xl font-bold text-neon-pink">3</h4>
                        <p className="text-sm text-gray-400">Subjects Studied</p>
                      </div>
                    </div>
                    
                    {/* Placeholder for chart */}
                    <div className="h-40 bg-white/5 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400">Study time distribution chart</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sidebar - 1/3 width on large screens */}
              <div className="space-y-6">
                {/* User Profile Card */}
                <Card className="glass-card">
                  <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-neon-purple to-neon-pink text-white text-2xl">JD</AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="text-white">John Doe</CardTitle>
                    <CardDescription>Computer Science Student</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Profile Completion</span>
                        <span className="text-neon-purple">85%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-neon-purple to-neon-pink rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 py-2 border-t border-white/10">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-neon-cyan mr-2"></div>
                        <span className="text-gray-400 text-sm">Web Development</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-neon-purple mr-2"></div>
                        <span className="text-gray-400 text-sm">Algorithm Design</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-neon-pink mr-2"></div>
                        <span className="text-gray-400 text-sm">Mobile App Development</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4 border-white/10 text-white">
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Suggested Buddies */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-neon-green">Suggested Buddies</CardTitle>
                    <CardDescription>People who match your study preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {suggestedBuddies.map(buddy => (
                        <div key={buddy.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={buddy.avatar} />
                              <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                                {buddy.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-white">{buddy.name}</h4>
                              <p className="text-xs text-gray-400">{buddy.subject}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-neon-green mr-2">{buddy.compatibility}</span>
                            <Button variant="ghost" size="sm" className="text-neon-purple hover:bg-neon-purple/10">
                              Connect
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full mt-2 border-white/10">
                        View All Matches
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Achievement Badges */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-neon-pink">Recent Badges</CardTitle>
                    <CardDescription>Achievements you've earned</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-neon-purple/20 flex items-center justify-center mb-1">
                          <Award className="h-6 w-6 text-neon-purple" />
                        </div>
                        <span className="text-xs text-gray-400">Fast Learner</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-neon-cyan/20 flex items-center justify-center mb-1">
                          <Award className="h-6 w-6 text-neon-cyan" />
                        </div>
                        <span className="text-xs text-gray-400">Team Player</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-neon-pink/20 flex items-center justify-center mb-1">
                          <Award className="h-6 w-6 text-neon-pink" />
                        </div>
                        <span className="text-xs text-gray-400">Knowledge Seeker</span>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <Link to="/badges" className="text-sm text-neon-purple hover:underline">
                        View all badges
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
          
          {/* Video conference component */}
          <VideoConference 
            open={videoConferenceOpen}
            onClose={() => setVideoConferenceOpen(false)}
            sessionData={currentSession}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
