
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from '@/components/DashboardSidebar';
import DigitalClock from '@/components/DigitalClock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Scheduling = () => {
  const [newSession, setNewSession] = useState({
    subject: '',
    date: '',
    time: '',
    duration: '1',
    description: '',
    inviteBuddies: []
  });
  
  // Mock study buddies data
  const myBuddies = [
    { id: 1, name: "Alex Johnson", subjects: ["Web Development"], avatar: "" },
    { id: 2, name: "Sarah Parker", subjects: ["Data Structures"], avatar: "" },
    { id: 3, name: "Michael Lee", subjects: ["Machine Learning"], avatar: "" }
  ];
  
  // Mock upcoming sessions
  const upcomingSessions = [
    {
      id: 1,
      subject: "Advanced JavaScript",
      date: "May 8, 2025",
      time: "3:00 PM",
      duration: "1 hour",
      buddies: ["Alex Johnson"],
      description: "Covering async/await, promises and advanced ES6+ features"
    },
    {
      id: 2,
      subject: "Data Structures",
      date: "May 10, 2025",
      time: "5:30 PM",
      duration: "1.5 hours",
      buddies: ["Sarah Parker"],
      description: "Trees and graph algorithms review"
    }
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSession({
      ...newSession,
      [name]: value
    });
  };
  
  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to a backend
    console.log("Scheduling session:", newSession);
    // Reset form or show confirmation
  };
  
  const handleBuddyToggle = (buddyId: number) => {
    const currentInvites = [...newSession.inviteBuddies];
    const index = currentInvites.indexOf(buddyId);
    
    if (index > -1) {
      currentInvites.splice(index, 1);
    } else {
      currentInvites.push(buddyId);
    }
    
    setNewSession({
      ...newSession,
      inviteBuddies: currentInvites
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        
        <div className="flex-1">
          <header className="border-b border-white/10 px-6 py-3 flex justify-between items-center bg-black/20 backdrop-blur-md">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white">Scheduling</h1>
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
              <h1 className="text-3xl font-bold text-white mb-2">Schedule Study Sessions</h1>
              <p className="text-gray-300">Plan your study time and invite your study buddies</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="glass-card mb-6">
                  <CardHeader>
                    <CardTitle className="text-neon-cyan">Upcoming Study Sessions</CardTitle>
                    <CardDescription>Your scheduled learning activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingSessions.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingSessions.map(session => (
                          <div key={session.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-start justify-between">
                              <div className="flex gap-4">
                                <div className="bg-neon-purple/20 p-3 rounded-full flex-shrink-0">
                                  <Calendar className="h-6 w-6 text-neon-purple" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-white text-lg">{session.subject}</h3>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {session.date} • {session.time} • {session.duration}
                                  </p>
                                  <p className="text-sm text-white/70 mt-2">{session.description}</p>
                                  <div className="mt-3">
                                    <div className="text-xs text-gray-400 mb-1">Participants:</div>
                                    <div className="flex -space-x-3">
                                      {session.buddies.map((buddy, i) => (
                                        <Avatar key={i} className="border-2 border-background h-8 w-8">
                                          <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan text-xs">
                                            {buddy.split(' ').map(n => n[0]).join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                      ))}
                                      <Avatar className="border-2 border-background h-8 w-8">
                                        <AvatarFallback className="bg-neon-pink/20 text-neon-pink text-xs">
                                          You
                                        </AvatarFallback>
                                      </Avatar>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10">
                                  Edit
                                </Button>
                                <Button size="sm" className="bg-neon-purple text-white">
                                  Join
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No upcoming sessions scheduled</p>
                        <p className="text-gray-500 text-sm mt-1">Create a new session to get started</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-neon-pink">Study Calendar</CardTitle>
                    <CardDescription>View all your scheduled sessions</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    {/* Calendar would normally go here, but for this example we'll use a placeholder */}
                    <div className="bg-white/5 rounded-lg border border-white/10 h-80 flex items-center justify-center">
                      <p className="text-gray-400">Calendar view would be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="glass-card sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-neon-green">Schedule New Session</CardTitle>
                    <CardDescription>Create a study session and invite buddies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSchedule} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Subject</label>
                        <input
                          type="text"
                          name="subject"
                          value={newSession.subject}
                          onChange={handleInputChange}
                          placeholder="e.g. JavaScript Basics"
                          className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Date</label>
                        <input
                          type="date"
                          name="date"
                          value={newSession.date}
                          onChange={handleInputChange}
                          className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Time</label>
                        <input
                          type="time"
                          name="time"
                          value={newSession.time}
                          onChange={handleInputChange}
                          className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Duration (hours)</label>
                        <select
                          name="duration"
                          value={newSession.duration}
                          onChange={handleInputChange}
                          className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
                        >
                          <option value="0.5">0.5</option>
                          <option value="1">1</option>
                          <option value="1.5">1.5</option>
                          <option value="2">2</option>
                          <option value="2.5">2.5</option>
                          <option value="3">3</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Description</label>
                        <textarea
                          name="description"
                          value={newSession.description}
                          onChange={handleInputChange}
                          placeholder="What will you study in this session?"
                          className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white h-24"
                        ></textarea>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Invite Study Buddies</label>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                          {myBuddies.map(buddy => (
                            <div 
                              key={buddy.id}
                              className={`flex items-center p-2 rounded-md ${
                                newSession.inviteBuddies.includes(buddy.id) 
                                  ? 'bg-neon-purple/20 border border-neon-purple/50'
                                  : 'bg-white/5 border border-white/10'
                              }`}
                              onClick={() => handleBuddyToggle(buddy.id)}
                            >
                              <div className="flex-1 flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan text-xs">
                                    {buddy.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-white text-sm">{buddy.name}</span>
                              </div>
                              <div className={`w-4 h-4 rounded-full border ${
                                newSession.inviteBuddies.includes(buddy.id)
                                  ? 'bg-neon-purple border-neon-purple'
                                  : 'border-gray-400'
                              }`}>
                                {newSession.inviteBuddies.includes(buddy.id) && (
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full bg-gradient-to-r from-neon-green to-neon-cyan text-white">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Session
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Scheduling;
