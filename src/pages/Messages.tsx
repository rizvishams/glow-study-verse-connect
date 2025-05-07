
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from '@/components/DashboardSidebar';
import DigitalClock from '@/components/DigitalClock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, User, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

const Messages = () => {
  // Mock conversations data
  const conversations = [
    {
      id: 1,
      name: "Alex Johnson",
      lastMessage: "Are we still meeting today at 3?",
      time: "10:45 AM",
      unread: 2,
      avatar: ""
    },
    {
      id: 2,
      name: "Sarah Parker",
      lastMessage: "Thanks for the help with that problem!",
      time: "Yesterday",
      unread: 0,
      avatar: ""
    },
    {
      id: 3,
      name: "Michael Lee",
      lastMessage: "I found a great resource for ML.",
      time: "May 5",
      unread: 0,
      avatar: ""
    }
  ];

  // Sample messages for the selected conversation
  const messages = [
    {
      id: 1,
      sender: "Alex Johnson",
      content: "Hey, how's your study going?",
      time: "10:30 AM",
      isMe: false
    },
    {
      id: 2,
      sender: "You",
      content: "Good! Working on the JavaScript project.",
      time: "10:32 AM",
      isMe: true
    },
    {
      id: 3,
      sender: "Alex Johnson",
      content: "Nice. I'm preparing for our session later.",
      time: "10:40 AM",
      isMe: false
    },
    {
      id: 4,
      sender: "Alex Johnson",
      content: "Are we still meeting today at 3?",
      time: "10:45 AM",
      isMe: false
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        
        <div className="flex-1">
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
          
          <main className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-64px)]">
            {/* Conversations list */}
            <div className="md:col-span-1 border-r border-white/10 overflow-y-auto">
              <div className="p-4">
                <Input 
                  type="search" 
                  placeholder="Search conversations..." 
                  className="bg-white/5 border-white/10 text-white" 
                />
              </div>
              
              <div className="space-y-1 px-2">
                {conversations.map(conversation => (
                  <div 
                    key={conversation.id}
                    className={`p-3 rounded-lg flex items-center space-x-3 cursor-pointer ${
                      conversation.id === 1 ? 'bg-neon-purple/20' : 'hover:bg-white/5'
                    }`}
                  >
                    <Avatar>
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">
                        {conversation.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium text-white truncate">{conversation.name}</h3>
                        <span className="text-xs text-gray-400">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="bg-neon-pink rounded-full h-5 w-5 flex items-center justify-center">
                        <span className="text-xs text-white">{conversation.unread}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Message area */}
            <div className="md:col-span-2 flex flex-col h-full">
              {/* Conversation header */}
              <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between bg-black/20">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">AJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-white">Alex Johnson</h3>
                    <p className="text-xs text-gray-400">Online</p>
                  </div>
                </div>
                <div>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-1" /> Profile
                  </Button>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${
                      message.isMe 
                        ? 'bg-neon-purple/30 rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                        : 'bg-white/10 rounded-tl-lg rounded-tr-lg rounded-br-lg'
                    } p-3`}>
                      {!message.isMe && (
                        <p className="text-xs text-neon-cyan mb-1">{message.sender}</p>
                      )}
                      <p className="text-white">{message.content}</p>
                      <p className="text-right text-xs text-gray-400 mt-1">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Type a message..." 
                    className="bg-white/5 border-white/10 text-white" 
                  />
                  <Button className="bg-neon-purple">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Messages;
