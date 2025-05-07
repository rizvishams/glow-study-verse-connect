
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from '@/components/DashboardSidebar';
import DigitalClock from '@/components/DigitalClock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Progress = () => {
  // Mock data for study progress
  const weeklyData = [
    { name: 'Mon', hours: 2 },
    { name: 'Tue', hours: 1.5 },
    { name: 'Wed', hours: 3 },
    { name: 'Thu', hours: 0.5 },
    { name: 'Fri', hours: 2 },
    { name: 'Sat', hours: 4 },
    { name: 'Sun', hours: 1 },
  ];
  
  const subjectData = [
    { name: 'Web Dev', hours: 8 },
    { name: 'Algorithms', hours: 4 },
    { name: 'Math', hours: 3 },
    { name: 'Physics', hours: 2 },
    { name: 'Design', hours: 1 },
  ];
  
  const studyHistoryEntries = [
    {
      date: "May 6, 2025",
      subject: "Web Development",
      duration: "2 hours",
      topics: ["React Hooks", "State Management"],
      buddy: "Emma Davis"
    },
    {
      date: "May 5, 2025",
      subject: "Algorithm Design",
      duration: "1.5 hours",
      topics: ["Dynamic Programming", "Graph Traversal"],
      buddy: "Michael Lee"
    },
    {
      date: "May 3, 2025",
      subject: "Web Development",
      duration: "3 hours",
      topics: ["CSS Animations", "Responsive Design"],
      buddy: "Self-study"
    },
    {
      date: "May 1, 2025",
      subject: "Mathematics",
      duration: "2 hours",
      topics: ["Linear Algebra", "Matrices"],
      buddy: "Sarah Johnson"
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        
        <div className="flex-1">
          <header className="border-b border-white/10 px-6 py-3 flex justify-between items-center bg-black/20 backdrop-blur-md">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white">Study History & Progress</h1>
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
              <h1 className="text-3xl font-bold text-white mb-2">Your Study Progress</h1>
              <p className="text-gray-300">Track your learning journey and study achievements</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-neon-purple">Weekly Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-4xl font-bold text-white">14</div>
                  <div className="text-sm text-gray-400">hours studied this week</div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Weekly Goal (20 hours)</span>
                      <span className="text-neon-purple">70%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-neon-purple to-neon-pink rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-neon-cyan">Monthly Statistics</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-4xl font-bold text-white">52</div>
                      <div className="text-sm text-gray-400">hours this month</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-neon-green">+12%</div>
                      <div className="text-xs text-gray-400">vs last month</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="text-sm text-gray-400">Sessions</div>
                      <div className="text-lg font-bold text-white">18</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Avg. Duration</div>
                      <div className="text-lg font-bold text-white">2.9h</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-neon-pink">Study Efficiency</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-4xl font-bold text-white">85%</div>
                      <div className="text-sm text-gray-400">focus rate</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-neon-green">+5%</div>
                      <div className="text-xs text-gray-400">vs previous week</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Morning Sessions</span>
                        <span className="text-neon-cyan">92%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-cyan rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Evening Sessions</span>
                        <span className="text-neon-purple">78%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-purple rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-neon-cyan">Weekly Study Hours</CardTitle>
                  <CardDescription>Hours studied by day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#ffffff80" 
                          tick={{ fill: '#ffffff80' }} 
                        />
                        <YAxis 
                          stroke="#ffffff80"
                          tick={{ fill: '#ffffff80' }}
                          label={{ 
                            value: 'Hours', 
                            angle: -90, 
                            position: 'insideLeft', 
                            fill: '#ffffff80' 
                          }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                        <Bar dataKey="hours" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-neon-pink">Hours by Subject</CardTitle>
                  <CardDescription>Time distribution across subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={subjectData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis 
                          type="number" 
                          stroke="#ffffff80" 
                          tick={{ fill: '#ffffff80' }}
                        />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          stroke="#ffffff80"
                          tick={{ fill: '#ffffff80' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                        <Bar dataKey="hours" fill="#D946EF" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-neon-green">Recent Study History</CardTitle>
                <CardDescription>Your most recent study sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studyHistoryEntries.map((entry, i) => (
                    <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 text-neon-green mr-2" />
                            <span className="text-gray-400 text-sm">{entry.date}</span>
                          </div>
                          <h3 className="font-medium text-white">{entry.subject}</h3>
                          <p className="text-sm text-neon-purple mt-1">{entry.duration}</p>
                          
                          <div className="mt-3">
                            <div className="text-xs text-gray-400 mb-1">Topics covered:</div>
                            <div className="flex flex-wrap gap-2">
                              {entry.topics.map((topic, j) => (
                                <span 
                                  key={j}
                                  className="px-2 py-0.5 rounded-full bg-white/10 text-white text-xs"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400 mb-1">Studied with</div>
                          <div className="flex items-center justify-end">
                            <span className="text-sm text-white mr-2">{entry.buddy}</span>
                            {entry.buddy !== "Self-study" && (
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan text-xs">
                                  {entry.buddy.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" className="border-white/20 text-white">
                    View All History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Progress;
