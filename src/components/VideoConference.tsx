
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from "sonner";

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
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  
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
  
  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      toast.success("Connected to camera and microphone");
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast.error("Could not access camera or microphone");
    }
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
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto glass-card p-0">
        <DialogHeader className="p-4 border-b border-white/10">
          <DialogTitle className="text-neon-cyan">
            {sessionData?.subject || "Study Session"} - {sessionData?.date || "Today"} ({sessionData?.time || "Now"})
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main video area - your webcam */}
            <div className="lg:col-span-2">
              <div className="relative bg-black/40 rounded-lg h-80 overflow-hidden">
                {localStream && videoEnabled ? (
                  <video 
                    ref={(videoEl) => {
                      if (videoEl && localStream) {
                        videoEl.srcObject = localStream;
                      }
                    }}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="bg-neon-purple text-white text-2xl">
                        You
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/40 text-white text-sm px-2 py-1 rounded">
                  You {!micEnabled && "(Muted)"}
                </div>
              </div>
            </div>
            
            {/* Participants video/avatar grid */}
            <div className="space-y-4">
              <h3 className="text-white font-medium mb-2">Participants</h3>
              
              {/* Placeholder for other participants */}
              {sessionData?.buddies && sessionData.buddies.map((buddy, index) => (
                <div key={index} className="bg-black/40 rounded-lg p-2">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">
                        {buddy.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white">{buddy}</p>
                      <p className="text-xs text-gray-400">Waiting to join...</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!sessionData?.buddies || sessionData.buddies.length === 0) && (
                <div className="text-center py-6 text-gray-400">
                  No other participants yet
                </div>
              )}
              
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 mt-4">
                <h4 className="text-white font-medium mb-2">Session Details</h4>
                <p className="text-sm text-gray-300">Subject: {sessionData?.subject || "Not specified"}</p>
                <p className="text-sm text-gray-300">Duration: {sessionData?.duration || "1"} hour(s)</p>
                <p className="text-sm text-gray-300">Started at: {sessionData?.time || "Now"}</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="border-t border-white/10 p-4">
          <div className="flex justify-center w-full space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              className={`rounded-full w-12 h-12 ${micEnabled ? 'bg-white/10' : 'bg-red-600/80 border-red-500'}`}
              onClick={toggleMic}
            >
              {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className={`rounded-full w-12 h-12 ${videoEnabled ? 'bg-white/10' : 'bg-red-600/80 border-red-500'}`}
              onClick={toggleVideo}
            >
              {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full w-12 h-12 bg-white/10"
              onClick={handleScreenShare}
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VideoConference;
