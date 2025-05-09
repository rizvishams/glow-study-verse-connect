
import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Bell } from 'lucide-react';
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { startFaceDetection, stopFaceDetection } from '@/utils/faceDetection';
import { loadJSZip, downloadFaceModels } from '@/utils/downloadFaceModels';
import { Button } from '@/components/ui/button';

interface DistractionDetectorProps {
  videoStreamRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
}

const DistractionDetector: React.FC<DistractionDetectorProps> = ({ videoStreamRef, isActive }) => {
  const [isDistracted, setIsDistracted] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);
  const [showModelPrompt, setShowModelPrompt] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alertTimeoutRef = useRef<number | null>(null);
  const detectionInitializedRef = useRef<boolean>(false);
  
  // Initialize face detection
  useEffect(() => {
    const initializeDetection = async () => {
      if (!isActive || !videoStreamRef.current || detectionInitializedRef.current) return;
      
      try {
        // Check if models exist by trying to fetch them
        const modelExists = await fetch('/models/tiny_face_detector_model-weights_manifest.json', { 
          method: 'HEAD' 
        }).then(res => res.ok).catch(() => false);
        
        if (!modelExists) {
          setShowModelPrompt(true);
        }
        
        // Start face detection
        const success = await startFaceDetection({
          videoElement: videoStreamRef.current,
          onDistracted: handleDistraction,
          onFocused: handleFocus,
          timeoutThreshold: 10 // 10 seconds without face detection triggers distraction
        });
        
        if (success) {
          detectionInitializedRef.current = true;
        }
      } catch (error) {
        console.error("Failed to initialize face detection:", error);
      }
    };
    
    // Wait for video to be ready
    if (isActive && videoStreamRef.current) {
      // Small delay to ensure video is playing
      const timer = setTimeout(() => {
        initializeDetection();
      }, 2000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isActive, videoStreamRef]);
  
  // Clean up when component unmounts or becomes inactive
  useEffect(() => {
    return () => {
      stopFaceDetection();
      detectionInitializedRef.current = false;
      
      if (alertTimeoutRef.current) {
        window.clearTimeout(alertTimeoutRef.current);
        alertTimeoutRef.current = null;
      }
    };
  }, []);
  
  // Create audio element for distraction notification
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.volume = 0.5;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Called when user is detected as distracted
  const handleDistraction = () => {
    setIsDistracted(true);
    setDistractionCount(prev => prev + 1);
    
    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.error("Failed to play notification:", err));
    }
    
    toast.warning("Distraction detected", {
      description: "Try to stay focused on your study session",
      duration: 6000,
      position: "top-center",
      style: { 
        backgroundColor: "rgba(249, 115, 22, 0.95)", 
        color: "white",
        fontWeight: "600",
        fontSize: "1.05rem",
        border: "2px solid #fbbf24"
      },
      icon: <Bell className="h-5 w-5 text-white animate-pulse" />
    });
    
    // Auto-clear distraction state after 8 seconds
    alertTimeoutRef.current = window.setTimeout(() => {
      setIsDistracted(false);
    }, 8000);
  };
  
  // Called when user is detected as focused again
  const handleFocus = () => {
    if (isDistracted) {
      setIsDistracted(false);
      
      if (alertTimeoutRef.current) {
        window.clearTimeout(alertTimeoutRef.current);
        alertTimeoutRef.current = null;
      }
      
      toast.success("Focus restored", {
        description: "Welcome back to your study session",
        duration: 2000,
      });
    }
  };

  // Handle downloading the models
  const handleDownloadModels = async () => {
    await loadJSZip();
    await downloadFaceModels();
    setShowModelPrompt(false);
  };
  
  if (!isActive) return null;
  
  return (
    <>
      {/* Model download prompt */}
      {showModelPrompt && (
        <div className="absolute top-2 left-2 right-2 bg-black/80 backdrop-blur-md p-4 rounded-lg border border-yellow-500/50 z-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-white">Face Detection Models Missing</h4>
              <p className="text-sm text-gray-300 mt-1 mb-3">
                For optimal distraction detection, please download and install the face detection models.
                We'll use a simplified detection method in the meantime.
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  variant="outline" 
                  className="text-xs border-gray-600"
                  onClick={() => setShowModelPrompt(false)}
                >
                  Continue Without Models
                </Button>
                <Button 
                  size="sm"
                  className="text-xs bg-yellow-600 hover:bg-yellow-700"
                  onClick={handleDownloadModels}
                >
                  Download Models
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isDistracted && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center">
          <Alert variant="destructive" className="w-96 max-w-[90vw] bg-red-900/95 border-4 border-red-500 backdrop-blur-md animate-pulse shadow-xl shadow-red-900/30">
            <AlertCircle className="h-6 w-6 text-red-300" />
            <AlertTitle className="text-xl text-white font-bold">Distraction Detected!</AlertTitle>
            <AlertDescription className="text-lg text-white/90">
              Try to stay focused on your study session.
            </AlertDescription>
          </Alert>
          <div className="bg-red-500 h-20 w-2 mt-6 animate-pulse rounded-full shadow-lg shadow-red-500/50"></div>
        </div>
      )}
      
      {/* Pulsing border during distraction */}
      {isDistracted && (
        <div className="fixed inset-0 border-8 border-red-500 rounded-lg animate-pulse pointer-events-none z-10"></div>
      )}
    </>
  );
};

export default DistractionDetector;
