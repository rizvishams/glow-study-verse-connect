import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from "sonner";
import DistractionDetector from './DistractionDetector';
import { useAuth } from '@/contexts/AuthContext';
import { database } from '@/utils/firebaseConfig';
import { ref, set, onValue, remove, off } from 'firebase/database';

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
  sessionId?: string;
}

// Generate a random session ID for connecting peers
const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const VideoConference = ({ open, onClose, sessionData, sessionId: providedSessionId }: VideoConferenceProps) => {
  const { user } = useAuth();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [distractionDetectionEnabled, setDistractionDetectionEnabled] = useState<boolean>(true);
  const [connectStatus, setConnectStatus] = useState<'waiting' | 'connecting' | 'connected'>('waiting');
  const [sessionId, setSessionId] = useState<string>(providedSessionId || generateSessionId());
  const [isHost, setIsHost] = useState<boolean>(!providedSessionId);
  
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
        // Added TURN servers for NAT traversal
        {
          urls: 'turn:global.turn.twilio.com:3478?transport=udp',
          username: 'f4b4035eaa76f4a55de5f4351567653ee4ff6fa97b50b6b334fcc1be9c27212d',
          credential: 'w1uxM55V9yVoqyVFjt+KsUcHxUzhuwwe5Jxbr6H21tA='
        },
        {
          urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
          username: 'f4b4035eaa76f4a55de5f4351567653ee4ff6fa97b50b6b334fcc1be9c27212d',
          credential: 'w1uxM55V9yVoqyVFjt+KsUcHxUzhuwwe5Jxbr6H21tA='
        }
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
        // Send ICE candidate to Firebase
        const candidateRef = ref(database, `sessions/${sessionId}/candidates/${isHost ? 'host' : 'peer'}/${Date.now()}`);
        set(candidateRef, {
          type: 'candidate',
          candidate: JSON.stringify(event.candidate),
          timestamp: Date.now()
        });
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
      
      // Set up session in Firebase if host
      if (isHost) {
        const sessionRef = ref(database, `sessions/${sessionId}/metadata`);
        set(sessionRef, {
          created: Date.now(),
          subject: sessionData?.subject || 'General Study',
          isActive: true
        });
        
        // Clean up session when host leaves
        return () => {
          if (isHost) {
            remove(ref(database, `sessions/${sessionId}`));
          }
        };
      }
    } else {
      // Clean up media when dialog closes
      cleanupConnection();
    }
  }, [open, isHost, sessionId]);
  
  // Listen for signaling messages from Firebase
  useEffect(() => {
    if (!open || !sessionId) return;
    
    // Set up listeners for offers, answers, and candidates
    const offersRef = ref(database, `sessions/${sessionId}/offers`);
    const answersRef = ref(database, `sessions/${sessionId}/answers`);
    const hostCandidatesRef = ref(database, `sessions/${sessionId}/candidates/host`);
    const peerCandidatesRef = ref(database, `sessions/${sessionId}/candidates/peer`);
    
    // Listen for offers (if peer)
    if (!isHost) {
      onValue(offersRef, (snapshot) => {
        const offerData = snapshot.val();
        if (offerData) {
          console.log("Received offer from Firebase");
          Object.values(offerData).forEach((offer: any) => {
            handleOffer(JSON.parse(offer.sdp));
          });
        }
      });
    }
    
    // Listen for answers (if host)
    if (isHost) {
      onValue(answersRef, (snapshot) => {
        const answerData = snapshot.val();
        if (answerData) {
          console.log("Received answer from Firebase");
          Object.values(answerData).forEach((answer: any) => {
            handleAnswer(JSON.parse(answer.sdp));
          });
        }
      });
    }
    
    // Listen for ICE candidates
    const candidatesRef = isHost ? peerCandidatesRef : hostCandidatesRef;
    onValue(candidatesRef, (snapshot) => {
      const candidateData = snapshot.val();
      if (candidateData) {
        console.log("Received ICE candidates from Firebase");
        Object.values(candidateData).forEach((data: any) => {
          handleIceCandidate(JSON.parse(data.candidate));
        });
      }
    });
    
    return () => {
      // Clean up Firebase listeners
      off(offersRef);
      off(answersRef);
      off(hostCandidatesRef);
      off(peerCandidatesRef);
    };
  }, [open, sessionId, isHost]);
  
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
    
    // Remove session from Firebase if host
    if (isHost) {
      remove(ref(database, `sessions/${sessionId}`))
        .catch(err => console.error("Error removing session:", err));
    }
  };
  
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
      
      // Send answer to Firebase
      const answerRef = ref(database, `sessions/${sessionId}/answers/${Date.now()}`);
      set(answerRef, {
        type: 'answer',
        sdp: JSON.stringify(answer),
        timestamp: Date.now()
      });
      
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
      
      // Send offer to Firebase
      const offerRef = ref(database, `sessions/${sessionId}/offers/${Date.now()}`);
      set(offerRef, {
        type: 'offer',
        sdp: JSON.stringify(offer),
        timestamp: Date.now()
      });
      
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
        
        {/* Distraction Alert */}
        <div id="distraction-alert" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-red-600/90 border-2 border-red-400 rounded-lg p-6 shadow-[0_0_30px_rgba(239,68,68,0.7)] hidden animate-pulse">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Focus Lost!</h3>
            <p className="text-white text-lg mb-4">Please return to your study session.</p>
            <button 
              className="px-4 py-2 bg-white text-red-600 font-medium rounded hover:bg-gray-100"
              onClick={() => {
                document.getElementById('distraction-alert')?.classList.add('hidden');
              }}
            >
              I'm Back
            </button>
          </div>
        </div>
        
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
