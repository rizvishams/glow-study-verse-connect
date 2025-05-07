
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from '@/components/DashboardSidebar';
import DigitalClock from '@/components/DigitalClock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

const FindBuddy = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedStudyStyle, setSelectedStudyStyle] = useState('');
  const [availability, setAvailability] = useState('');

  const subjects = [
    'Web Development', 'Data Science', 'Mathematics', 'Physics', 
    'Literature', 'History', 'Chemistry', 'Biology', 'Psychology',
    'Computer Science', 'Art', 'Music', 'Language Learning', 'Business'
  ];

  const studyStyles = [
    'Discussing Concepts', 
    'Coding Together', 
    'Problem Solving', 
    'Reading & Analysis', 
    'Project Collaboration'
  ];
  
  const availabilityOptions = [
    'Morning (6AM - 12PM)',
    'Afternoon (12PM - 5PM)',
    'Evening (5PM - 10PM)',
    'Late Night (10PM - 6AM)',
    'Weekends Only',
    'Weekdays Only',
    'Flexible'
  ];
  
  // Mock potential buddies
  const potentialBuddies = [
    {
      id: 1,
      name: "Emma Davis",
      subjects: ["Web Development", "Computer Science"],
      studyStyle: "Coding Together",
      availability: "Evening (5PM - 10PM)",
      compatibility: 95,
      avatar: ""
    },
    {
      id: 2,
      name: "Michael Lee",
      subjects: ["Web Development", "Data Science"],
      studyStyle: "Problem Solving",
      availability: "Afternoon (12PM - 5PM)",
      compatibility: 88,
      avatar: ""
    },
    {
      id: 3,
      name: "Sarah Johnson",
      subjects: ["Computer Science", "Mathematics"],
      studyStyle: "Discussing Concepts",
      availability: "Evening (5PM - 10PM)",
      compatibility: 82,
      avatar: ""
    },
    {
      id: 4,
      name: "James Wilson",
      subjects: ["Web Development", "Computer Science"],
      studyStyle: "Coding Together",
      availability: "Morning (6AM - 12PM)",
      compatibility: 79,
      avatar: ""
    }
  ];

  const handleSubjectToggle = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleFindMatches = () => {
    // In a real app, this would send the query to a backend
    console.log('Finding matches with: ', {
      subjects: selectedSubjects,
      studyStyle: selectedStudyStyle,
      availability: availability
    });
    // The results would be dynamically loaded
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        
        <div className="flex-1">
          <header className="border-b border-white/10 px-6 py-3 flex justify-between items-center bg-black/20 backdrop-blur-md">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white">Find Study Buddy</h1>
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
              <h1 className="text-3xl font-bold text-white mb-2">Find Your Perfect Study Partner</h1>
              <p className="text-gray-300">Set your preferences and we'll match you with compatible study buddies</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <Card className="glass-card sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-neon-purple">Study Preferences</CardTitle>
                    <CardDescription>Tell us what you're looking for</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-white font-medium">Subjects</label>
                      <p className="text-xs text-gray-400 mb-2">Select all that apply</p>
                      <div className="flex flex-wrap gap-2">
                        {subjects.map(subject => (
                          <button
                            key={subject}
                            className={`px-3 py-1.5 rounded-full text-sm ${
                              selectedSubjects.includes(subject)
                                ? 'bg-neon-purple text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                            onClick={() => handleSubjectToggle(subject)}
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-white font-medium">Study Style</label>
                      <p className="text-xs text-gray-400 mb-2">How do you like to study?</p>
                      <div className="flex flex-wrap gap-2">
                        {studyStyles.map(style => (
                          <button
                            key={style}
                            className={`px-3 py-1.5 rounded-full text-sm ${
                              selectedStudyStyle === style
                                ? 'bg-neon-cyan text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                            onClick={() => setSelectedStudyStyle(style)}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-white font-medium">Availability</label>
                      <p className="text-xs text-gray-400 mb-2">When are you available to study?</p>
                      <div className="flex flex-wrap gap-2">
                        {availabilityOptions.map(option => (
                          <button
                            key={option}
                            className={`px-3 py-1.5 rounded-full text-sm ${
                              availability === option
                                ? 'bg-neon-pink text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                            onClick={() => setAvailability(option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-neon-purple to-neon-pink text-white" 
                      onClick={handleFindMatches}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Find Matching Buddies
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-white mb-4">Potential Study Buddies</h2>
                <div className="space-y-4">
                  {potentialBuddies.map(buddy => (
                    <Card key={buddy.id} className="glass-card hover:border-neon-purple transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-14 w-14">
                            <AvatarImage src={buddy.avatar} />
                            <AvatarFallback className="bg-neon-purple/20 text-neon-purple text-lg">
                              {buddy.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <h3 className="font-medium text-white text-lg">{buddy.name}</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {buddy.subjects.map((subject, i) => (
                                <span 
                                  key={i} 
                                  className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 text-xs"
                                >
                                  {subject}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-lg font-bold text-neon-green mb-1">{buddy.compatibility}%</div>
                            <div className="text-xs text-gray-400">match</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <div className="text-xs text-gray-400 mb-1">Study Style</div>
                            <div className="text-white">{buddy.studyStyle}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-400 mb-1">Availability</div>
                            <div className="text-white">{buddy.availability}</div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end space-x-3">
                          <Button variant="outline" className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10">
                            View Profile
                          </Button>
                          <Button className="bg-neon-purple text-white">
                            Connect
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default FindBuddy;
