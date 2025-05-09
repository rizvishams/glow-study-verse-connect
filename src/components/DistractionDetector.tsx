
import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { startFaceDetection, stopFaceDetection } from '@/utils/faceDetection';
import { loadJSZip, downloadFaceModels } from '@/utils/downloadFaceModels';

interface DistractionDetectorProps {
  videoStreamRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
}

const DistractionDetector: React.FC<DistractionDetectorProps> = ({ videoStreamRef, isActive }) => {
  const [isDistracted, setIsDistracted] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alertTimeoutRef = useRef<number | null>(null);
  const detectionInitializedRef = useRef<boolean>(false);
  
  // Initialize face detection
  useEffect(() => {
    const initializeDetection = async () => {
      if (!isActive || !videoStreamRef.current || detectionInitializedRef.current) return;
      
      try {
        // Ensure face models are available
        await loadJSZip();
        
        // Start face detection
        const success = await startFaceDetection({
          videoElement: videoStreamRef.current,
          onDistracted: handleDistraction,
          onFocused: handleFocus,
          timeoutThreshold: 10 // 10 seconds without face detection triggers distraction
        });
        
        if (success) {
          detectionInitializedRef.current = true;
        } else {
          // Offer to download models if detection fails
          const shouldDownload = window.confirm(
            "Face detection models might be missing. Would you like to download them?"
          );
          
          if (shouldDownload) {
            downloadFaceModels();
          }
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
  
  if (!isActive) return null;
  
  return (
    <>
      {isDistracted && (
        <Alert variant="destructive" className="fixed top-4 right-4 w-72 bg-red-900/80 border-red-700 backdrop-blur-sm animate-fade-in z-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Distraction Detected</AlertTitle>
          <AlertDescription>
            Try to stay focused on your study session.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Pulsing border during distraction */}
      {isDistracted && (
        <div className="absolute inset-0 border-4 border-red-500 rounded-lg animate-pulse pointer-events-none z-10"></div>
      )}
    </>
  );
};

export default DistractionDetector;
