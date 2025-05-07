
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Send, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";

interface AIStudyBuddyProps {
  subject?: string;
}

const AIStudyBuddy: React.FC<AIStudyBuddyProps> = ({ subject = "general studies" }) => {
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'ai'}[]>([
    {
      text: `Hi there! I'm your AI Study Buddy. I noticed no one was available to connect right now, but I'm here to help with your ${subject} studies. What would you like to discuss?`,
      sender: 'ai'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const updatedMessages = [...messages, {text: newMessage, sender: 'user' as const}];
    setMessages(updatedMessages);
    setNewMessage('');
    setIsThinking(true);
    
    // Simulate AI response
    setTimeout(() => {
      let response = '';
      
      // Generate contextual responses based on message content
      const userQuestion = newMessage.toLowerCase();
      
      if (userQuestion.includes('help') && userQuestion.includes('study')) {
        response = `I'd be happy to help you study! What specific topic within ${subject} would you like to focus on?`;
      } else if (userQuestion.includes('explain') || userQuestion.includes('what is')) {
        response = `That's a great question about ${subject}! The concept you're asking about is fundamental. Let me explain it in simple terms: it relates to the core principles of the subject and builds upon the foundational knowledge. Would you like me to elaborate on any specific aspect?`;
      } else if (userQuestion.includes('example') || userQuestion.includes('problem')) {
        response = `Here's a practice problem related to ${subject} that might help: [Example problem]. Try working through this step by step, and let me know where you get stuck.`;
      } else if (userQuestion.includes('test') || userQuestion.includes('exam')) {
        response = `To prepare for your ${subject} exam, focus on these key areas: understanding core concepts, practicing problems regularly, reviewing your notes, and getting enough rest before the exam. Would you like study tips for any specific topic?`;
      } else {
        response = `That's an interesting point about ${subject}! Let's explore that further. Can you tell me more about what you're trying to understand or accomplish?`;
      }
      
      setMessages([...updatedMessages, {text: response, sender: 'ai' as const}]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <Card className="glass-card h-full flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-white/10">
          <Avatar>
            <AvatarFallback className="bg-neon-cyan text-background">AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-white">AI Study Assistant</h3>
            <p className="text-xs text-gray-400">Always available to help</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.sender === 'user' 
                    ? 'bg-neon-purple text-white' 
                    : 'bg-white/10 text-white'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-white max-w-[80%] rounded-lg px-4 py-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-end space-x-2">
          <Textarea 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="bg-white/10 text-white border-white/20 resize-none"
            rows={2}
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
            disabled={isThinking}
          >
            <Send size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIStudyBuddy;
