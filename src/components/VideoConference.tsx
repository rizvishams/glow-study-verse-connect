
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

// Generate a random session ID for connecting peers
const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const VideoConference = ({ open, onClose, sessionData }: VideoConferenceProps) => {
  const { user } = useAuth();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [distractionDetectionEnabled, setDistractionDetectionEnabled] = useState<boolean>(true);
  const [connectStatus, setConnectStatus] = useState<'waiting' | 'connecting' | 'connected'>('waiting');
  const [sessionId, setSessionId] = useState<string>(generateSessionId());
  const [isHost, setIsHost] = useState<boolean>(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  
  // Initialize WebRTC
  const initializeWebRTC = () => {
    // Create a new peer connection
    const config = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
      ]
    };
    
    const pc = new RTCPeerConnection(config);
    peerConnectionRef.current = pc;
    
    // Add local stream tracks to the connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }
    
    // Set up handlers for remote stream
    pc.ontrack = event => {
      console.log("Received remote track", event.streams[0]);
      setRemoteStream(event.streams[0]);
    };
    
    // Set up data channel for messaging
    if (isHost) {
      const dataChannel = pc.createDataChannel("chat");
      dataChannel.onopen = () => console.log("Data channel opened");
      dataChannel.onclose = () => console.log("Data channel closed");
      dataChannel.onmessage = e => console.log("Received message:", e.data);
      dataChannelRef.current = dataChannel;
    } else {
      pc.ondatachannel = event => {
        const dataChannel = event.channel;
        dataChannel.onopen = () => console.log("Data channel opened");
        dataChannel.onclose = () => console.log("Data channel closed");
        dataChannel.onmessage = e => console.log("Received message:", e.data);
        dataChannelRef.current = dataChannel;
      };
    }
    
    // ICE candidate handling
    pc.onicecandidate = event => {
      if (event.candidate) {
        console.log("New ICE candidate:", event.candidate);
        // In a real app, you would send this to the signaling server
        // For this demo, we'll simulate signaling through localStorage
        const candidateData = {
          sessionId: sessionId,
          candidate: event.candidate,
          type: 'ice-candidate',
          fromHost: isHost
        };
        localStorage.setItem(`webrtc-candidate-${isHost ? 'host' : 'peer'}-${Date.now()}`, 
          JSON.stringify(candidateData));
      }
    };
    
    // Connection state change
    pc.onconnectionstatechange = () => {
      console.log("Connection state:", pc.connectionState);
      if (pc.connectionState === 'connected') {
        setConnectStatus('connected');
        toast.success("Connected with study buddy!");
      } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        toast.error("Connection lost with study buddy");
      }
    };
    
    return pc;
  };
  
  // Initialize webcam and microphone when dialog opens
  useEffect(() => {
    if (open) {
      initializeMedia();
    } else {
      // Clean up media when dialog closes
      cleanupConnection();
    }
  }, [open]);
  
  // Cleanup function for connections
  const cleanupConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
  };
  
  // Handle signaling through localStorage (simulated signaling server)
  useEffect(() => {
    if (!open || !sessionId) return;
    
    // Listen for signaling messages
    const checkInterval = setInterval(() => {
      // Check for all stored messages
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Skip non-WebRTC keys
        if (!key || !key.startsWith('webrtc-')) continue;
        
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          
          // Skip messages not for this session
          if (data.sessionId !== sessionId) continue;
          
          // Skip messages from self
          if ((isHost && data.fromHost) || (!isHost && !data.fromHost)) continue;
          
          console.log("Processing signaling message:", data.type);
          
          // Handle different message types
          if (data.type === 'offer' && !isHost) {
            handleOffer(data.offer);
          } else if (data.type === 'answer' && isHost) {
            handleAnswer(data.answer);
          } else if (data.type === 'ice-candidate') {
            handleIceCandidate(data.candidate);
          }
          
          // Remove processed message
          localStorage.removeItem(key);
        } catch (error) {
          console.error("Error processing signaling message:", error);
        }
      }
    }, 1000);
    
    return () => {
      clearInterval(checkInterval);
    };
  }, [open, sessionId, isHost]);
  
  // Handle incoming offer
  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) {
      initializeWebRTC();
    }
    
    const pc = peerConnectionRef.current;
    if (!pc) return;
    
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      // Send answer
      localStorage.setItem(`webrtc-answer-${Date.now()}`, JSON.stringify({
        sessionId,
        type: 'answer',
        answer,
        fromHost: isHost
      }));
      
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  };
  
  // Handle incoming answer
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;
    
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  };
  
  // Handle ICE candidate
  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;
    
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  };
  
  // Create and send offer (for host)
  const createOffer = async () => {
    const pc = peerConnectionRef.current;
    if (!pc) return;
    
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      // Send offer through simulated signaling
      localStorage.setItem(`webrtc-offer-${Date.now()}`, JSON.stringify({
        sessionId,
        type: 'offer',
        offer,
        fromHost: isHost
      }));
      
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };
  
  // Set video element's srcObject when streams change
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
    
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
      
      // Initialize WebRTC and start connecting
      const pc = initializeWebRTC();
      setConnectStatus('waiting');
      
      // If host, create offer after a short delay
      if (isHost) {
        setTimeout(() => {
          setConnectStatus('connecting');
          toast.info("Finding a study buddy...");
          createOffer();
        }, 1500);
      } else {
        setConnectStatus('connecting');
        toast.info("Connecting to study session...");
      }
      
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setPermissionStatus('denied');
      toast.error("Could not access camera or microphone");
    }
  };
  
  // Helper function to join an existing session
  const joinExistingSession = (newSessionId: string) => {
    setSessionId(newSessionId);
    setIsHost(false);
    
    if (permissionStatus === 'granted') {
      // Already have media, just initialize WebRTC
      initializeWebRTC();
      setConnectStatus('connecting');
    } else {
      // Need to get media first
      initializeMedia();
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
    cleanupConnection();
    toast.info("Study session ended");
    onClose();
  };
  
  const handleScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true,
        audio: true
      });
      
      // Replace video track with screen sharing track
      if (peerConnectionRef.current && localStream) {
        const videoSender = peerConnectionRef.current.getSenders().find(
          sender => sender.track?.kind === 'video'
        );
        
        if (videoSender) {
          videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
        }
        
        // Update local video with screen share
        const newStream = new MediaStream();
        screenStream.getVideoTracks().forEach(track => newStream.addTrack(track));
        localStream.getAudioTracks().forEach(track => newStream.addTrack(track));
        
        setLocalStream(newStream);
        
        // Add listener to detect when screen sharing stops
        screenStream.getVideoTracks()[0].onended = async () => {
          // Revert to camera
          const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoSender && cameraStream.getVideoTracks()[0]) {
            videoSender.replaceTrack(cameraStream.getVideoTracks()[0]);
          }
          
          // Update local stream
          const revertedStream = new MediaStream();
          cameraStream.getVideoTracks().forEach(track => revertedStream.addTrack(track));
          localStream.getAudioTracks().forEach(track => revertedStream.addTrack(track));
          setLocalStream(revertedStream);
          
          toast.info("Screen sharing ended");
        };
        
        toast.success("Screen sharing started");
      }
    } catch (error) {
      console.error("Error starting screen share:", error);
      toast.error("Could not start screen sharing");
    }
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
  
  // For testing: ability to join a specific session
  const handleJoinSession = () => {
    const sessionToJoin = prompt("Enter session ID to join:");
    if (sessionToJoin) {
      joinExistingSession(sessionToJoin);
    }
  };
  
  // Share session ID for others to join
  const handleShareSession = () => {
    navigator.clipboard.writeText(sessionId);
    toast.success("Session ID copied to clipboard! Share with your study buddy.");
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
            {isHost && (
              <div className="mt-2">
                <button 
                  onClick={handleShareSession} 
                  className="text-neon-cyan underline text-sm"
                >
                  Share this session (ID: {sessionId.substring(0, 8)}...)
                </button>
              </div>
            )}
            {!isHost && (
              <div className="mt-2 text-sm">
                Connected to session {sessionId.substring(0, 8)}...
              </div>
            )}
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
                            <button 
                              className="text-neon-cyan underline text-sm mt-4"
                              onClick={handleJoinSession}
                            >
                              Join existing session
                            </button>
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
              disabled={permissionStatus !== 'granted' || connectStatus !== 'connected'}
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
