
import { toast } from "sonner";

export interface FaceDetectionOptions {
  videoElement: HTMLVideoElement;
  onDistracted: () => void;
  onFocused: () => void;
  timeoutThreshold?: number; // seconds
}

let faceDetectionModel: any = null;
let lastTimeWithFace: number | null = null;
let distracted = false;
let detectionInterval: number | null = null;

// Load face-api.js dynamically
const loadFaceDetectionScript = async () => {
  if (typeof (window as any).faceapi !== 'undefined') {
    return Promise.resolve();
  }
  
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load face-api.js'));
    document.head.appendChild(script);
  });
};

// Initialize face detection models
const initializeFaceDetection = async () => {
  try {
    await loadFaceDetectionScript();
    const faceapi = (window as any).faceapi;
    
    if (!faceapi) {
      console.error("Face API not loaded");
      return false;
    }
    
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    return true;
  } catch (error) {
    console.error("Error initializing face detection:", error);
    return false;
  }
};

// Start face detection
export const startFaceDetection = async ({
  videoElement,
  onDistracted,
  onFocused,
  timeoutThreshold = 10 // Default 10 seconds
}: FaceDetectionOptions): Promise<boolean> => {
  if (!videoElement) {
    console.error("No video element provided");
    return false;
  }
  
  const modelLoaded = await initializeFaceDetection();
  if (!modelLoaded) {
    toast.error("Failed to load face detection. Please refresh and try again.");
    return false;
  }
  
  const faceapi = (window as any).faceapi;
  if (!faceapi) {
    console.error("Face API not available");
    return false;
  }
  
  lastTimeWithFace = Date.now();
  distracted = false;
  
  // Create detection loop
  detectionInterval = window.setInterval(async () => {
    if (videoElement.paused || videoElement.ended) return;
    
    try {
      const detections = await faceapi.detectAllFaces(
        videoElement,
        new faceapi.TinyFaceDetectorOptions()
      );
      
      const now = Date.now();
      const secondsSinceLastFace = lastTimeWithFace ? (now - lastTimeWithFace) / 1000 : 0;
      
      if (detections.length > 0) {
        // Face detected
        lastTimeWithFace = now;
        
        if (distracted) {
          distracted = false;
          onFocused();
        }
      } else if (!distracted && secondsSinceLastFace > timeoutThreshold) {
        // No face detected for longer than threshold
        distracted = true;
        onDistracted();
      }
    } catch (error) {
      console.error("Face detection error:", error);
    }
  }, 1000); // Check every second
  
  return true;
};

// Stop face detection
export const stopFaceDetection = () => {
  if (detectionInterval !== null) {
    window.clearInterval(detectionInterval);
    detectionInterval = null;
  }
  
  lastTimeWithFace = null;
  distracted = false;
};

// Check if models directory exists in public folder
document.addEventListener('DOMContentLoaded', () => {
  // Create the models directory structure if it doesn't exist
  const createModelDirectories = async () => {
    try {
      const response = await fetch('/models/tiny_face_detector_model-weights_manifest.json', {
        method: 'HEAD'
      });
      
      if (!response.ok) {
        console.warn("Face detection models not found. Face detection features may not work correctly.");
        toast.warning("Face detection models not found. Please add models to your public folder.");
      }
    } catch (error) {
      console.warn("Could not verify face detection models:", error);
    }
  };
  
  createModelDirectories();
});
