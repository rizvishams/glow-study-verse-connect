
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 relative">
      {/* Background Elements */}
      <div className="absolute top-40 right-20 w-72 h-72 bg-neon-purple/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl"></div>
      
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            About <span className="text-neon-cyan text-glow-cyan">Us</span>
          </h2>
          <p className="text-lg text-gray-300">
            We're on a mission to transform how students learn together by creating meaningful study connections.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="glass-card overflow-hidden">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-neon-purple">Our Mission</CardTitle>
              <CardDescription>Creating better learning experiences</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-300">
                Study Buddy Finder was born from a simple observation: learning is better together. Our platform helps students find the perfect study partners based on their subjects, goals, and learning styles, creating connections that make education more effective and enjoyable.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card overflow-hidden">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-neon-cyan">Why Choose Us</CardTitle>
              <CardDescription>Benefits that make a difference</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-neon-purple flex items-center justify-center mt-1">
                  <span className="text-xs font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">Smart Matching</h4>
                  <p className="text-gray-400">Advanced algorithms to find your ideal study partners</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-neon-cyan flex items-center justify-center mt-1">
                  <span className="text-xs font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">Productivity Tools</h4>
                  <p className="text-gray-400">Pomodoro timers, distraction detection, and more</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-neon-pink flex items-center justify-center mt-1">
                  <span className="text-xs font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">Seamless Communication</h4>
                  <p className="text-gray-400">Built-in messaging and video conferencing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
