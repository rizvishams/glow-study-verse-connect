
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from '@/components/DashboardSidebar';
import DigitalClock from '@/components/DigitalClock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Pomodoro = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentMode, setCurrentMode] = useState('work'); // work, shortBreak, longBreak
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive) {
      interval = window.setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            clearInterval(interval);
            setIsActive(false);
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);
  
  const handleTimerComplete = () => {
    // Play sound or notification
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log('Audio play failed', e));
    
    if (currentMode === 'work') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      if (newSessionsCompleted % 4 === 0) {
        // Every 4th session, take a long break
        setCurrentMode('longBreak');
        setMinutes(15);
      } else {
        setCurrentMode('shortBreak');
        setMinutes(5);
      }
    } else {
      // Back to work mode after any break
      setCurrentMode('work');
      setMinutes(25);
    }
    setSeconds(0);
  };
  
  const startTimer = () => {
    setIsActive(true);
  };
  
  const pauseTimer = () => {
    setIsActive(false);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    if (currentMode === 'work') {
      setMinutes(25);
    } else if (currentMode === 'shortBreak') {
      setMinutes(5);
    } else {
      setMinutes(15);
    }
    setSeconds(0);
  };
  
  const setMode = (mode: string) => {
    setIsActive(false);
    setCurrentMode(mode);
    if (mode === 'work') {
      setMinutes(25);
    } else if (mode === 'shortBreak') {
      setMinutes(5);
    } else {
      setMinutes(15);
    }
    setSeconds(0);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        
        <div className="flex-1">
          <header className="border-b border-white/10 px-6 py-3 flex justify-between items-center bg-black/20 backdrop-blur-md">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white">Pomodoro Timer</h1>
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
              <h1 className="text-3xl font-bold text-white mb-2">Pomodoro Technique Timer</h1>
              <p className="text-gray-300">Stay focused and productive with timed work sessions and breaks</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardContent className="p-10 flex flex-col items-center">
                    <div className={`text-8xl font-bold mb-6 ${
                      currentMode === 'work' ? 'text-neon-pink' :
                      currentMode === 'shortBreak' ? 'text-neon-cyan' :
                      'text-neon-purple'
                    }`}>
                      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                    </div>
                    
                    <div className="flex space-x-3 mb-8">
                      <Button 
                        className={`${currentMode === 'work' ? 'bg-neon-pink' : 'bg-white/10'}`} 
                        onClick={() => setMode('work')}
                      >
                        Work
                      </Button>
                      <Button 
                        className={`${currentMode === 'shortBreak' ? 'bg-neon-cyan' : 'bg-white/10'}`} 
                        onClick={() => setMode('shortBreak')}
                      >
                        Short Break
                      </Button>
                      <Button 
                        className={`${currentMode === 'longBreak' ? 'bg-neon-purple' : 'bg-white/10'}`} 
                        onClick={() => setMode('longBreak')}
                      >
                        Long Break
                      </Button>
                    </div>
                    
                    <div className="flex space-x-4">
                      {!isActive ? (
                        <Button onClick={startTimer} className="bg-neon-green text-white px-8">
                          Start
                        </Button>
                      ) : (
                        <Button onClick={pauseTimer} className="bg-neon-orange text-white px-8">
                          Pause
                        </Button>
                      )}
                      <Button onClick={resetTimer} variant="outline" className="border-white/20 text-white">
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-neon-cyan">Current Session</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white">Mode:</span>
                        <span className={`font-medium ${
                          currentMode === 'work' ? 'text-neon-pink' :
                          currentMode === 'shortBreak' ? 'text-neon-cyan' :
                          'text-neon-purple'
                        }`}>
                          {currentMode === 'work' ? 'Work Session' : 
                           currentMode === 'shortBreak' ? 'Short Break' : 
                           'Long Break'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">Sessions Completed:</span>
                        <span className="font-medium text-neon-green">{sessionsCompleted}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">Status:</span>
                        <span className={`${isActive ? 'text-neon-green' : 'text-neon-orange'} font-medium`}>
                          {isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-neon-purple">About Pomodoro Technique</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80">
                      The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s.
                    </p>
                    <div className="space-y-2">
                      <h3 className="text-neon-pink font-medium">How it works:</h3>
                      <ul className="list-disc list-inside text-white/70 space-y-1">
                        <li>Work for 25 minutes (one "Pomodoro" session)</li>
                        <li>Take a short 5-minute break</li>
                        <li>After completing 4 Pomodoros, take a longer break (15-30 minutes)</li>
                        <li>Repeat the cycle</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-neon-cyan font-medium">Benefits:</h3>
                      <ul className="list-disc list-inside text-white/70 space-y-1">
                        <li>Improves focus and concentration</li>
                        <li>Reduces mental fatigue</li>
                        <li>Increases accountability</li>
                        <li>Helps manage distractions</li>
                        <li>Creates a better work/break balance</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-neon-green">Pro Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-white/90">
                        <span className="text-neon-green font-bold">💡 </span>
                        Use the Pomodoro timer for tasks that require deep focus and concentration.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-white/90">
                        <span className="text-neon-purple font-bold">💡 </span>
                        During breaks, step away from your screen to rest your eyes.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-white/90">
                        <span className="text-neon-pink font-bold">💡 </span>
                        Keep a list of distractions that occur to you during a Pomodoro and address them during breaks.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Pomodoro;
