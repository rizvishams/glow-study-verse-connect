
import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DistractionDetectorProps {
  videoStreamRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
}

const DistractionDetector: React.FC<DistractionDetectorProps> = ({ videoStreamRef, isActive }) => {
  const [isDistracted, setIsDistracted] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);
  const detectionIntervalRef = useRef<number | null>(null);
  
  // Simulate distraction detection
  // In a real implementation, this would use computer vision libraries
  useEffect(() => {
    if (!isActive) {
      if (detectionIntervalRef.current) {
        window.clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      return;
    }
    
    const simulateDistractionDetection = () => {
      // Simulated detection logic
      // In a real implementation, this would analyze facial expressions, eye gaze, etc.
      const randomFactor = Math.random();
      
      // 15% chance of detecting distraction
      if (randomFactor < 0.15) {
        setIsDistracted(true);
        setDistractionCount(prev => prev + 1);
        
        toast.warning("Distraction detected", {
          description: "Try to stay focused on your study session",
          duration: 4000,
        });
        
        // Reset distraction state after 3 seconds
        setTimeout(() => {
          setIsDistracted(false);
        }, 3000);
      }
    };
    
    // Set interval to check for distractions
    detectionIntervalRef.current = window.setInterval(simulateDistractionDetection, 25000);
    
    return () => {
      if (detectionIntervalRef.current) {
        window.clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isActive]);
  
  if (!isActive) return null;
  
  return (
    <>
      {isDistracted && (
        <Alert variant="destructive" className="fixed top-4 right-4 w-72 bg-red-900/80 border-red-700 backdrop-blur-sm animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Distraction Detected</AlertTitle>
          <AlertDescription>
            Try to stay focused on your study session.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default DistractionDetector;
