
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px]"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-background"></div>
      
      {/* Animated circles */}
      <div className="absolute top-20 left-20 w-60 h-60 bg-neon-purple/20 rounded-full blur-3xl animate-pulse-neon"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse-neon"></div>
      
      <div className="container px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Find Your Perfect <span className="text-neon-purple text-glow">Study Buddy</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10">
            Connect with like-minded learners, boost productivity, and make learning enjoyable with our matchmaking platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-neon-purple to-neon-pink text-white text-lg px-8 py-6 rounded-xl shadow-neon-pink">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#about">
              <Button variant="outline" className="text-neon-cyan border-neon-cyan text-lg px-8 py-6 rounded-xl hover:bg-neon-cyan/10">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      {/* 3D-like floating objects */}
      <div className="hidden md:block absolute top-1/4 left-1/6 w-20 h-20 bg-gradient-to-br from-neon-purple/30 to-neon-pink/30 backdrop-blur-md rounded-2xl rotate-12 animate-float" style={{animationDelay: '0.5s'}}></div>
      <div className="hidden md:block absolute bottom-1/3 right-1/6 w-16 h-16 bg-gradient-to-br from-neon-cyan/30 to-neon-green/30 backdrop-blur-md rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      <div className="hidden md:block absolute top-2/3 right-1/4 w-24 h-24 bg-gradient-to-br from-neon-pink/30 to-neon-purple/30 backdrop-blur-md rounded-lg -rotate-12 animate-float" style={{animationDelay: '1.5s'}}></div>
    </div>
  );
};

export default HeroBanner;
