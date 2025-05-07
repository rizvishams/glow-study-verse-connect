
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from '@/components/DashboardSidebar';
import DigitalClock from '@/components/DigitalClock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Badges = () => {
  // Sample badge data
  const badges = [
    {
      id: 1,
      name: "Fast Learner",
      description: "Complete 5 study sessions in one week",
      icon: "award",
      color: "neon-purple",
      earned: true
    },
    {
      id: 2,
      name: "Team Player",
      description: "Participate in 10 group study sessions",
      icon: "award",
      color: "neon-cyan",
      earned: true
    },
    {
      id: 3,
      name: "Knowledge Seeker",
      description: "Study 3 different subjects",
      icon: "award",
      color: "neon-pink",
      earned: true
    },
    {
      id: 4,
      name: "Consistency King",
      description: "Complete at least one session every day for a week",
      icon: "award",
      color: "neon-green",
      earned: false
    },
    {
      id: 5,
      name: "Focus Master",
      description: "Complete a 2-hour session with minimal distractions",
      icon: "award",
      color: "neon-yellow",
      earned: false
    },
    {
      id: 6,
      name: "Early Bird",
      description: "Complete 5 study sessions before 9 AM",
      icon: "award",
      color: "neon-orange",
      earned: false
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        
        <div className="flex-1">
          <header className="border-b border-white/10 px-6 py-3 flex justify-between items-center bg-black/20 backdrop-blur-md">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white">Earn Badges</h1>
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
              <h1 className="text-3xl font-bold text-white mb-2">Achievement Badges</h1>
              <p className="text-gray-300">Earn badges to track your progress and show off your achievements</p>
            </div>
            
            <div className="mb-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-neon-pink">Your Stats</CardTitle>
                  <CardDescription>Your current progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                      <h3 className="text-2xl font-bold text-neon-purple">3</h3>
                      <p className="text-sm text-gray-400">Badges Earned</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                      <h3 className="text-2xl font-bold text-neon-cyan">50%</h3>
                      <p className="text-sm text-gray-400">Badge Completion</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                      <h3 className="text-2xl font-bold text-neon-pink">8</h3>
                      <p className="text-sm text-gray-400">Hours Studied</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                      <h3 className="text-2xl font-bold text-neon-green">4</h3>
                      <p className="text-sm text-gray-400">Sessions Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {badges.map(badge => (
                <Card key={badge.id} className={`glass-card ${badge.earned ? 'border-' + badge.color : 'opacity-70'}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className={`h-16 w-16 rounded-full bg-${badge.color}/20 flex items-center justify-center mb-4`}>
                        <Award className={`h-8 w-8 text-${badge.color}`} />
                      </div>
                      <h3 className="font-medium text-white text-lg mb-1">{badge.name}</h3>
                      <p className="text-sm text-gray-400 mb-4">{badge.description}</p>
                      <div className="mt-auto">
                        {badge.earned ? (
                          <span className={`px-3 py-1 rounded-full bg-${badge.color}/20 text-${badge.color} text-xs font-medium`}>
                            Earned
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-white/10 text-gray-400 text-xs font-medium">
                            In Progress
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Badges;
