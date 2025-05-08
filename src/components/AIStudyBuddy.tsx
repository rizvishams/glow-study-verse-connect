
import React, { useState, useRef, useEffect } from 'react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const updatedMessages = [...messages, {text: newMessage, sender: 'user' as const}];
    setMessages(updatedMessages);
    setNewMessage('');
    setIsThinking(true);
    
    // Enhanced AI responses using a more sophisticated approach
    setTimeout(() => {
      let response = '';
      const userQuestion = newMessage.toLowerCase();
      
      // More intelligent response generation based on message content
      if (userQuestion.includes('help') && userQuestion.includes('study')) {
        response = `I'd be happy to help you study! What specific topic within ${subject} would you like to focus on?`;
      } 
      else if (userQuestion.includes('explain') || userQuestion.includes('what is')) {
        const topics = userQuestion.replace(/explain|what is|what are|tell me about|how does/gi, '').trim();
        response = `That's a great question about ${topics || subject}! This concept relates to fundamental principles in the field. The key points to understand are:\n\n1. The basic definition and purpose\n2. The core mechanisms and processes involved\n3. How it connects to other related concepts\n4. Real-world applications and examples\n\nWould you like me to elaborate on any specific aspect?`;
      } 
      else if (userQuestion.includes('example') || userQuestion.includes('problem')) {
        response = `Here's a practice problem related to ${subject} that might help:\n\nProblem: [A specific problem relevant to ${subject}]\n\nApproach:\n1. Identify the key variables and constraints\n2. Apply the relevant formulas or principles\n3. Work step-by-step toward the solution\n\nTry working through this process, and let me know where you get stuck or if you'd like more guidance.`;
      } 
      else if (userQuestion.includes('test') || userQuestion.includes('exam')) {
        response = `To prepare for your ${subject} exam, I recommend focusing on these key areas:\n\n1. Core concepts and definitions\n2. Problem-solving techniques and frameworks\n3. Common pitfalls and misconceptions\n4. Practice applying knowledge in different contexts\n\nWould you like a study plan for the next few days before your exam?`;
      } 
      else if (userQuestion.includes('hello') || userQuestion.includes('hi') || userQuestion.includes('hey')) {
        response = `Hello! I'm your AI Study Buddy for ${subject}. How can I assist you with your studies today?`;
      }
      else if (userQuestion.includes('thank')) {
        response = `You're welcome! I'm glad I could help. Feel free to ask if you have any other questions about ${subject} or need more assistance.`;
      }
      else if (userQuestion.includes('why') || userQuestion.includes('how come')) {
        response = `That's an excellent "why" question! Understanding the reasoning behind concepts in ${subject} is crucial. The explanation involves several key principles:\n\n1. Cause-effect relationships in this domain\n2. Historical development of these ideas\n3. Empirical evidence supporting the concept\n\nWould you like me to elaborate on any of these points?`;
      }
      else if (userQuestion.includes('compare') || userQuestion.includes('difference between')) {
        response = `Comparing concepts in ${subject} helps deepen understanding. Here's a breakdown:\n\nConcept A:\n- Key characteristics\n- Main applications\n- Core strengths\n\nConcept B:\n- Key characteristics (different from A)\n- Alternative applications\n- Different advantages\n\nThe main distinction lies in how these concepts approach problem-solving in different contexts.`;
      }
      else {
        // General fallback with more intelligent responses
        const generalResponses = [
          `That's an interesting perspective on ${subject}! Let's explore it further. Can you elaborate on what aspect you're most curious about?`,
          `Great question! In ${subject}, this relates to several important concepts. Would you like me to break it down step by step?`,
          `I see you're interested in this aspect of ${subject}. This is actually connected to broader principles in the field. Would you like me to explain the foundations first or dive directly into this specific topic?`,
          `That's a thoughtful question about ${subject}. To give you the most helpful answer, could you share what you already understand about this concept so I can build on your knowledge?`
        ];
        response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
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
                {msg.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < msg.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
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
          <div ref={messagesEndRef} />
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
