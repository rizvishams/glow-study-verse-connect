
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from '@/components/DashboardSidebar';
import DigitalClock from '@/components/DigitalClock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Settings as SettingsIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Settings = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        
        <div className="flex-1">
          <header className="border-b border-white/10 px-6 py-3 flex justify-between items-center bg-black/20 backdrop-blur-md">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white">Settings</h1>
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
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-300">Customize your study experience</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 max-w-3xl">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-neon-cyan">Account Settings</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Display Name</label>
                    <input type="text" defaultValue="John Doe" className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Email</label>
                    <input type="email" defaultValue="john.doe@example.com" className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white" readOnly />
                  </div>
                  <Button className="bg-neon-purple text-white">Update Profile</Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-neon-pink">Notification Settings</CardTitle>
                  <CardDescription>Control how and when you receive alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Session Reminders</span>
                    <div className="relative inline-block w-12 align-middle select-none">
                      <input type="checkbox" id="session-reminders" defaultChecked className="sr-only peer" />
                      <div className="block h-6 bg-white/20 rounded-full peer-checked:bg-neon-purple w-12"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-6"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">New Match Alerts</span>
                    <div className="relative inline-block w-12 align-middle select-none">
                      <input type="checkbox" id="match-alerts" defaultChecked className="sr-only peer" />
                      <div className="block h-6 bg-white/20 rounded-full peer-checked:bg-neon-cyan w-12"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-6"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Message Notifications</span>
                    <div className="relative inline-block w-12 align-middle select-none">
                      <input type="checkbox" id="message-notifs" defaultChecked className="sr-only peer" />
                      <div className="block h-6 bg-white/20 rounded-full peer-checked:bg-neon-pink w-12"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-6"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-neon-green">Study Preferences</CardTitle>
                  <CardDescription>Customize your learning approach</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Primary Study Area</label>
                    <select className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white">
                      <option>Web Development</option>
                      <option>Data Science</option>
                      <option>Mobile Development</option>
                      <option>Machine Learning</option>
                      <option>UI/UX Design</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Study Session Duration</label>
                    <select className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>1.5 hours</option>
                      <option>2 hours</option>
                    </select>
                  </div>
                  <Button className="bg-neon-green text-white">Save Preferences</Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
