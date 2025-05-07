
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black/60 backdrop-blur-md border-t border-white/10 py-10">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent mb-4 block">
              StudyBuddyFinder
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Connect with like-minded learners, boost productivity, and make learning enjoyable with our matchmaking platform.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-neon-purple transition-colors">Home</Link></li>
              <li><a href="#about" className="text-gray-400 hover:text-neon-purple transition-colors">About Us</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-neon-purple transition-colors">Services</a></li>
              <li><Link to="/auth" className="text-gray-400 hover:text-neon-purple transition-colors">Login / Sign Up</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Email: support@studybuddy.com</li>
              <li className="text-gray-400">Phone: (123) 456-7890</li>
              <li className="text-gray-400">Follow us on social media</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} StudyBuddyFinder. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-neon-purple transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-neon-purple transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
