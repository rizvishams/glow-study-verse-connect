
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Calendar, Video, Award, Clock, Users } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: <Search className="h-10 w-10 text-neon-purple" />,
      title: "Buddy Matching",
      description: "Find study partners who match your subjects, goals, and learning style."
    },
    {
      icon: <Calendar className="h-10 w-10 text-neon-cyan" />,
      title: "Study Scheduling",
      description: "Create and manage study sessions with an intuitive calendar system."
    },
    {
      icon: <Video className="h-10 w-10 text-neon-pink" />,
      title: "Virtual Study Rooms",
      description: "Connect via video and audio for interactive study sessions."
    },
    {
      icon: <Award className="h-10 w-10 text-neon-green" />,
      title: "Earning Badges",
      description: "Get rewarded for consistent study habits and achievements."
    },
    {
      icon: <Clock className="h-10 w-10 text-neon-blue" />,
      title: "Pomodoro Technique",
      description: "Stay focused with built-in timers for productive study sessions."
    },
    {
      icon: <Users className="h-10 w-10 text-neon-purple" />,
      title: "Community Building",
      description: "Join subject-based groups and expand your learning network."
    }
  ];

  return (
    <section id="services" className="py-20 relative">
      {/* Background Elements */}
      <div className="absolute top-20 left-20 w-80 h-80 bg-neon-pink/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl"></div>
      
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Our <span className="text-neon-pink text-glow-pink">Services</span>
          </h2>
          <p className="text-lg text-gray-300">
            Everything you need to transform your study experience and achieve your learning goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="glass-card hover:border-white/20 transition-all hover:-translate-y-1 duration-300">
              <CardHeader className="pb-4">
                <div className="mb-3">{service.icon}</div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
