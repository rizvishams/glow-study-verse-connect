
import { Bell, LogIn, Menu, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import DigitalClock from './DigitalClock';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="py-4 px-6 z-50 sticky top-0 backdrop-blur-lg bg-black/50 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
            StudyBuddyFinder
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-white hover:text-neon-purple transition-colors">Home</Link>
          <a href="#about" className="text-white hover:text-neon-purple transition-colors">About Us</a>
          <a href="#services" className="text-white hover:text-neon-purple transition-colors">Services</a>
          {isLoggedIn ? (
            <Link to="/dashboard" className="text-white hover:text-neon-purple transition-colors">Dashboard</Link>
          ) : null}
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <DigitalClock />
          
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" className="text-white hover:text-neon-cyan hover:bg-white/10">
                <Bell className="w-5 h-5" />
              </Button>
              <Link to="/dashboard">
                <Button variant="ghost" size="icon" className="text-white hover:text-neon-cyan hover:bg-white/10">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="outline" className="border-neon-purple text-neon-purple hover:text-white hover:bg-neon-purple/20 transition-colors">
                <LogIn className="mr-2 h-4 w-4" />
                Login / Sign Up
              </Button>
            </Link>
          )}
          
          <Link to={isLoggedIn ? "/find-buddy" : "/auth"}>
            <Button className="bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-neon-pink">
              Find Buddy
            </Button>
          </Link>
        </div>
        
        <div className="md:hidden flex items-center gap-4">
          <DigitalClock />
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-white hover:text-neon-purple"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/95 backdrop-blur-lg z-40 flex flex-col p-6 gap-6 items-center justify-start pt-10">
          <Link to="/" className="text-xl text-white" onClick={() => setIsOpen(false)}>Home</Link>
          <a href="#about" className="text-xl text-white" onClick={() => setIsOpen(false)}>About Us</a>
          <a href="#services" className="text-xl text-white" onClick={() => setIsOpen(false)}>Services</a>
          {isLoggedIn && (
            <Link to="/dashboard" className="text-xl text-white" onClick={() => setIsOpen(false)}>Dashboard</Link>
          )}
          
          {isLoggedIn ? (
            <div className="flex gap-4 mt-4">
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="border-neon-cyan text-neon-cyan">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/auth" onClick={() => setIsOpen(false)} className="mt-4">
              <Button variant="outline" className="border-neon-purple text-neon-purple">
                <LogIn className="mr-2 h-4 w-4" />
                Login / Sign Up
              </Button>
            </Link>
          )}
          
          <Link to={isLoggedIn ? "/find-buddy" : "/auth"} onClick={() => setIsOpen(false)} className="mt-4">
            <Button className="bg-gradient-to-r from-neon-purple to-neon-pink text-white">
              Find Buddy
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
