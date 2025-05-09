
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
let modelLoadAttempted = false;
let usingFallbackDetection = false;

// Load face-api.js dynamically
const loadFaceDetectionScript = async () => {
  if (typeof (window as any).faceapi !== 'undefined') {
    return Promise.resolve();
  }
  
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
    script.async = true;
    script.onload = () => {
      console.log("Face API script loaded successfully");
      resolve();
    };
    script.onerror = (e) => {
      console.error("Failed to load face-api.js", e);
      reject(new Error('Failed to load face-api.js'));
    };
    document.head.appendChild(script);
  });
};

// Check if models are available
const checkModelsAvailable = async () => {
  try {
    const response = await fetch('/models/tiny_face_detector_model-weights_manifest.json', {
      method: 'HEAD'
    });
    return response.ok;
  } catch (error) {
    console.warn("Could not verify face detection models:", error);
    return false;
  }
};

// Initialize face detection models
const initializeFaceDetection = async () => {
  try {
    if (modelLoadAttempted) {
      return faceDetectionModel !== null;
    }
    
    modelLoadAttempted = true;
    
    // Load face-api.js script
    await loadFaceDetectionScript();
    const faceapi = (window as any).faceapi;
    
    if (!faceapi) {
      console.error("Face API not loaded");
      return false;
    }
    
    // Check if models are available
    const modelsAvailable = await checkModelsAvailable();
    
    if (!modelsAvailable) {
      console.warn("Face detection models not found in /models directory");
      // Switch to fallback detection
      usingFallbackDetection = true;
      faceDetectionModel = true; // Just a placeholder to indicate we're using fallback
      return true;
    }
    
    // Try to load models from the public path
    try {
      console.log("Loading face detection models from /models directory");
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      console.log("Face detection models loaded successfully");
      faceDetectionModel = faceapi.nets.tinyFaceDetector;
      return true;
    } catch (error) {
      console.error("Error loading face detection models from /models:", error);
      
      // Try loading from CDN as fallback
      try {
        console.log("Attempting to load face detection models from CDN");
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        console.log("Face detection models loaded successfully from CDN");
        faceDetectionModel = faceapi.nets.tinyFaceDetector;
        return true;
      } catch (cdnError) {
        console.error("Error loading face detection models from CDN:", cdnError);
        // Switch to fallback detection
        usingFallbackDetection = true;
        faceDetectionModel = true; // Just a placeholder to indicate we're using fallback
        return true;
      }
    }
  } catch (error) {
    console.error("Error initializing face detection:", error);
    // Switch to fallback detection
    usingFallbackDetection = true;
    faceDetectionModel = true; // Just a placeholder to indicate we're using fallback
    return true;
  }
};

// Fallback detection based on pixel difference
const fallbackDetection = (videoElement: HTMLVideoElement) => {
  if (!videoElement || videoElement.paused || videoElement.ended) {
    return false;
  }
  
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return false;
    
    canvas.width = 100; // small size for efficiency
    canvas.height = 100;
    
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Check if there's significant variation in pixels (crude detection of a face)
    // This checks if the frame isn't just a blank or static image
    let variationCount = 0;
    let lastPixel = data[0];
    let totalPixels = data.length / 4;
    
    for (let i = 0; i < data.length; i += 16) {
      if (Math.abs(data[i] - lastPixel) > 20) {
        variationCount++;
      }
      lastPixel = data[i];
    }
    
    // If there's enough variation, assume a face is present
    return (variationCount / (totalPixels / 4)) > 0.1;
  } catch (error) {
    console.error("Error in fallback detection:", error);
    return true; // Assume user is present rather than falsely triggering alerts
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
    toast.error("Failed to initialize face detection. Using basic detection instead.");
  }
  
  const faceapi = (window as any).faceapi;
  
  lastTimeWithFace = Date.now();
  distracted = false;
  
  // Create detection loop
  detectionInterval = window.setInterval(async () => {
    if (videoElement.paused || videoElement.ended) return;
    
    try {
      let faceDetected = false;
      
      if (usingFallbackDetection) {
        // Use our simple fallback detection
        faceDetected = fallbackDetection(videoElement);
      } else if (faceapi) {
        // Use face-api.js if available
        const detections = await faceapi.detectAllFaces(
          videoElement,
          new faceapi.TinyFaceDetectorOptions()
        );
        faceDetected = detections && detections.length > 0;
      }
      
      const now = Date.now();
      const secondsSinceLastFace = lastTimeWithFace ? (now - lastTimeWithFace) / 1000 : 0;
      
      if (faceDetected) {
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
      // If detection throws an error, assume face is present rather than falsely triggering alerts
      lastTimeWithFace = Date.now();
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
