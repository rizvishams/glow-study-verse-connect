
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from "sonner";
import DistractionDetector from './DistractionDetector';
import { useAuth } from '@/contexts/AuthContext';

interface VideoConferenceProps {
  open: boolean;
  onClose: () => void;
  sessionData: {
    subject: string;
    date: string;
    time: string;
    duration: string;
    buddies: string[];
  } | null;
}

const VideoConference = ({ open, onClose, sessionData }: VideoConferenceProps) => {
  const { user } = useAuth();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [distractionDetectionEnabled, setDistractionDetectionEnabled] = useState<boolean>(true);
  const [connectStatus, setConnectStatus] = useState<'waiting' | 'connecting' | 'connected'>('waiting');
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Initialize webcam and microphone when dialog opens
  useEffect(() => {
    if (open) {
      initializeMedia();
    } else {
      // Clean up media when dialog closes
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
    }
  }, [open]);
  
  useEffect(() => {
    // Set video element's srcObject when localStream changes
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
    
    // Set remote video element's srcObject when remoteStream changes
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);
  
  const initializeMedia = async () => {
    try {
      setPermissionStatus('pending');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      setPermissionStatus('granted');
      toast.success("Connected to camera and microphone");
      
      // Simulate connecting to a peer after a delay
      simulatePeerConnection();
      
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setPermissionStatus('denied');
      toast.error("Could not access camera or microphone");
    }
  };
  
  // Simulate connecting to a remote peer
  const simulatePeerConnection = () => {
    setConnectStatus('waiting');
    
    // Simulate searching for a peer
    setTimeout(() => {
      setConnectStatus('connecting');
      toast.info("Finding a study buddy...");
      
      // Simulate connection established
      setTimeout(() => {
        // Create a simulated remote stream (in a real app, this would come from WebRTC)
        if (localStream) {
          // For demo, we'll just use our own stream as the remote one
          // In a real app, this would be from the peer connection
          setRemoteStream(localStream);
          setConnectStatus('connected');
          toast.success("Connected with study buddy!");
        }
      }, 3000);
    }, 2000);
  };
  
  const toggleMic = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const enabled = !micEnabled;
        audioTracks[0].enabled = enabled;
        setMicEnabled(enabled);
        toast.info(enabled ? "Microphone unmuted" : "Microphone muted");
      }
    }
  };
  
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        const enabled = !videoEnabled;
        videoTracks[0].enabled = enabled;
        setVideoEnabled(enabled);
        toast.info(enabled ? "Camera turned on" : "Camera turned off");
      }
    }
  };
  
  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    toast.info("Study session ended");
    onClose();
  };
  
  const handleScreenShare = () => {
    // In a real implementation, this would use the Screen Capture API
    toast.info("Screen sharing is not implemented in this demo");
  };
  
  const toggleDistractionDetection = () => {
    setDistractionDetectionEnabled(prev => !prev);
    toast.info(distractionDetectionEnabled ? 
      "Distraction detection disabled" : 
      "Distraction detection enabled"
    );
  };
  
  // Retry accessing media if permissions were denied
  const handleRetryPermissions = () => {
    initializeMedia();
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto glass-card p-0">
        <DialogHeader className="p-4 border-b border-white/10">
          <DialogTitle className="text-neon-cyan">
            {sessionData?.subject || "Study Session"} - {sessionData?.date || "Today"} ({sessionData?.time || "Now"})
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Video Conference Study Session
          </DialogDescription>
        </DialogHeader>
        
        {permissionStatus === 'denied' ? (
          <div className="p-10 text-center">
            <div className="bg-red-500/20 rounded-full p-4 inline-block mb-4">
              <VideoOff className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-xl text-white font-medium mb-2">Camera or Microphone Access Denied</h3>
            <p className="text-gray-400 mb-6">
              To join this video study session, you need to allow access to your camera and microphone.
            </p>
            <Button 
              className="bg-neon-cyan text-background"
              onClick={handleRetryPermissions}
            >
              Grant Permission
            </Button>
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main video area - your webcam */}
              <div className="lg:col-span-2">
                <div className="relative bg-black/40 rounded-lg h-80 overflow-hidden">
                  {localStream && videoEnabled ? (
                    <video 
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback className="bg-neon-purple text-white text-2xl">
                          {user ? user.name.split(' ').map(n => n[0]).join('') : 'You'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-black/40 text-white text-sm px-2 py-1 rounded">
                    {user ? user.name : 'You'} {!micEnabled && "(Muted)"}
                  </div>
                  
                  {/* Connection status */}
                  {connectStatus !== 'connected' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                      <div className="text-center">
                        {connectStatus === 'waiting' && (
                          <>
                            <div className="w-16 h-16 border-4 border-t-neon-cyan border-neon-cyan/30 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-white text-xl">Waiting for a study buddy...</p>
                          </>
                        )}
                        
                        {connectStatus === 'connecting' && (
                          <>
                            <div className="w-16 h-16 border-4 border-t-neon-green border-neon-green/30 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-white text-xl">Connecting with study buddy...</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Distraction detection toggle */}
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`text-xs ${
                        distractionDetectionEnabled 
                          ? 'bg-neon-green/20 border-neon-green text-neon-green hover:bg-neon-green/30'
                          : 'bg-gray-500/20 border-gray-500 text-gray-400 hover:bg-gray-500/30'
                      }`}
                      onClick={toggleDistractionDetection}
                    >
                      {distractionDetectionEnabled ? 'Focus Monitor: ON' : 'Focus Monitor: OFF'}
                    </Button>
                  </div>
                  
                  {/* Distraction detection component */}
                  <DistractionDetector 
                    videoStreamRef={videoRef}
                    isActive={open && permissionStatus === 'granted' && videoEnabled && distractionDetectionEnabled}
                  />
                </div>
              </div>
              
              {/* Remote participant video */}
              <div className="space-y-4">
                <h3 className="text-white font-medium mb-2">Study Buddy</h3>
                
                <div className="bg-black/40 rounded-lg overflow-hidden relative h-48">
                  {connectStatus === 'connected' && remoteStream ? (
                    <video 
                      ref={remoteVideoRef}
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {connectStatus === 'connected' ? (
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-neon-cyan text-white">
                            SB
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <p className="text-gray-400">Waiting for connection...</p>
                      )}
                    </div>
                  )}
                  
                  {connectStatus === 'connected' && (
                    <div className="absolute bottom-2 left-2 bg-black/40 text-white text-xs px-2 py-1 rounded">
                      Study Buddy
                    </div>
                  )}
                </div>
                
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 mt-4">
                  <h4 className="text-white font-medium mb-2">Session Details</h4>
                  <p className="text-sm text-gray-300">Subject: {sessionData?.subject || "Not specified"}</p>
                  <p className="text-sm text-gray-300">Duration: {sessionData?.duration || "1"} hour(s)</p>
                  <p className="text-sm text-gray-300">Started at: {sessionData?.time || "Now"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="border-t border-white/10 p-4">
          <div className="flex justify-center w-full space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              className={`rounded-full w-12 h-12 ${micEnabled ? 'bg-white/10' : 'bg-red-600/80 border-red-500'}`}
              onClick={toggleMic}
              disabled={permissionStatus !== 'granted'}
            >
              {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className={`rounded-full w-12 h-12 ${videoEnabled ? 'bg-white/10' : 'bg-red-600/80 border-red-500'}`}
              onClick={toggleVideo}
              disabled={permissionStatus !== 'granted'}
            >
              {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full w-12 h-12 bg-white/10"
              onClick={handleScreenShare}
              disabled={permissionStatus !== 'granted'}
            >
              <ScreenShare className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="destructive" 
              size="icon" 
              className="rounded-full w-12 h-12 bg-red-600 hover:bg-red-700"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full w-12 h-12 bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
              onClick={() => {
                handleEndCall();
                window.location.href = '/messages';
              }}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VideoConference;
