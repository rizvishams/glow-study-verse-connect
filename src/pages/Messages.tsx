
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from '@/components/DashboardSidebar';
import DigitalClock from '@/components/DigitalClock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Send, MessageSquare, Video, Mic, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import { useLocation, useNavigate } from 'react-router-dom';
import AIStudyBuddy from '@/components/AIStudyBuddy';
import VideoConference from '@/components/VideoConference';

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'buddy'}[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [videoCallActive, setVideoCallActive] = useState(false);
  
  // Get buddy info from location state, if available
  const buddy = location.state?.buddy || null;
  const isAI = location.state?.isAI || false;
  const subject = location.state?.subject || 'general studies';
  
  useEffect(() => {
    // Add initial welcome message if buddy exists
    if (buddy && messages.length === 0) {
      setMessages([{
        text: `Hi there! I'm ${buddy.name}. I'm excited to study ${buddy.subjects[0]} with you!`,
        sender: 'buddy'
      }]);
    }
  }, [buddy]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    setMessages([...messages, {text: newMessage, sender: 'user'}]);
    setNewMessage('');
    
    // If it's not an AI buddy, simulate a response
    if (!isAI) {
      setTimeout(() => {
        // Generic responses based on message content
        const userMessage = newMessage.toLowerCase();
        let response = '';
        
        if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
          response = "Hi there! How can I help with your studies today?";
        } else if (userMessage.includes('study')) {
          response = "I'm ready to study! What topic should we focus on first?";
        } else if (userMessage.includes('help')) {
          response = "I'd be happy to help! What are you having trouble with?";
        } else if (userMessage.includes('thank')) {
          response = "You're welcome! Let me know if you need anything else.";
        } else if (userMessage.includes('?')) {
          response = "That's a good question. Let me think about it... I think the key concept here is understanding the fundamentals first.";
        } else {
          response = "That's interesting. Can you tell me more about what you're studying?";
        }
        
        setMessages(prev => [...prev, {text: response, sender: 'buddy'}]);
      }, 1500);
    }
  };
  
  const handleStartVideoCall = () => {
    const sessionData = {
      subject: buddy ? buddy.subjects[0] : subject,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      duration: "1 hour",
      buddies: buddy ? [buddy.name] : []
    };
    
    setVideoCallActive(true);
    toast.success("Starting video call...");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b border-white/10 px-6 py-3 flex justify-between items-center bg-black/20 backdrop-blur-md">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white">Messages</h1>
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
          
          <main className="p-6 flex-1 flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
              {/* Contacts sidebar */}
              <div className="lg:col-span-1">
                <Card className="glass-card h-full">
                  <CardHeader>
                    <CardTitle className="text-neon-purple">Contacts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 px-2">
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start rounded-md p-3 ${buddy || isAI ? 'bg-white/10' : ''}`}
                    >
                      {isAI ? (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback className="bg-neon-cyan text-background">AI</AvatarFallback>
                        </Avatar>
                      ) : buddy ? (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                            {buddy.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1 text-left">
                        <div className="text-white">{isAI ? "AI Study Buddy" : buddy ? buddy.name : "No contacts yet"}</div>
                        {(buddy || isAI) && <p className="text-xs text-gray-400">{subject}</p>}
                      </div>
                    </Button>
                    
                    <div className="text-center mt-6 text-gray-400 text-sm">
                      <p>Find more study buddies</p>
                      <Button 
                        variant="outline" 
                        className="border-neon-purple text-neon-purple hover:bg-neon-purple/10 mt-2"
                        onClick={() => navigate('/find-buddy')}
                        size="sm"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Find Buddies
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Chat area */}
              <div className="lg:col-span-3 flex flex-col h-full">
                {isAI ? (
                  <AIStudyBuddy subject={subject} />
                ) : (
                  <Card className="glass-card flex-1 flex flex-col h-full">
                    <CardHeader className="border-b border-white/10 flex-shrink-0">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          {buddy ? (
                            <>
                              <Avatar>
                                <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                                  {buddy.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium text-white">{buddy.name}</h3>
                                <p className="text-xs text-gray-400">
                                  {buddy.subjects.join(', ')} • {buddy.studyStyle}
                                </p>
                              </div>
                            </>
                          ) : (
                            <div className="text-white">Select a contact to start chatting</div>
                          )}
                        </div>
                        
                        {buddy && (
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="rounded-full border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
                              onClick={handleStartVideoCall}
                            >
                              <Video className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="rounded-full border-neon-purple text-neon-purple hover:bg-neon-purple/10"
                            >
                              <Mic className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 overflow-y-auto py-6 px-4">
                      {buddy ? (
                        <div className="space-y-4">
                          {messages.map((msg, idx) => (
                            <div 
                              key={idx} 
                              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              {msg.sender === 'buddy' && (
                                <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                                  <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                                    {buddy.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div 
                                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                  msg.sender === 'user' 
                                    ? 'bg-neon-purple text-white' 
                                    : 'bg-white/10 text-white'
                                }`}
                              >
                                {msg.text}
                              </div>
                              {msg.sender === 'user' && (
                                <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
                                  <AvatarFallback className="bg-neon-pink/20 text-neon-pink">
                                    You
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          ))}
                          
                          {messages.length === 0 && (
                            <div className="text-center py-10">
                              <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                              <p className="text-gray-400">No messages yet</p>
                              <p className="text-gray-500 text-sm">Send a message to start the conversation</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <MessageSquare className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No conversation selected</p>
                            <p className="text-gray-500 mt-2">Select a contact or find a new study buddy</p>
                            <Button 
                              className="mt-4 bg-neon-purple text-white"
                              onClick={() => navigate('/find-buddy')}
                            >
                              Find Study Buddy
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    
                    {buddy && (
                      <div className="border-t border-white/10 p-4">
                        <div className="flex space-x-2">
                          <Textarea 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="bg-white/10 text-white border-white/20 resize-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button 
                            className="bg-neon-cyan text-background flex-shrink-0"
                            onClick={handleSendMessage}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                )}
              </div>
            </div>
          </main>
          
          {/* Video conference component */}
          <VideoConference 
            open={videoCallActive}
            onClose={() => setVideoCallActive(false)}
            sessionData={{
              subject: buddy ? buddy.subjects[0] : subject,
              date: new Date().toLocaleDateString(),
              time: new Date().toLocaleTimeString(),
              duration: "1 hour",
              buddies: buddy ? [buddy.name] : []
            }}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Messages;
