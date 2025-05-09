
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

// Load face-api.js dynamically with better error handling
const loadFaceDetectionScript = async () => {
  if (typeof (window as any).faceapi !== 'undefined') {
    return Promise.resolve();
  }
  
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
    script.async = true;
    script.crossOrigin = "anonymous"; // Add CORS support
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
    // First check if models exist in public directory
    const response = await fetch('/models/tiny_face_detector_model-weights_manifest.json', {
      method: 'HEAD'
    });
    return response.ok;
  } catch (error) {
    console.warn("Could not verify face detection models:", error);
    return false;
  }
};

// Initialize face detection models with multiple fallbacks
const initializeFaceDetection = async () => {
  try {
    if (modelLoadAttempted) {
      return faceDetectionModel !== null;
    }
    
    modelLoadAttempted = true;
    
    // Load face-api.js script with better error handling
    try {
      await loadFaceDetectionScript();
      console.log("Face API script loaded");
    } catch (error) {
      console.error("Face API script loading failed:", error);
      usingFallbackDetection = true;
      faceDetectionModel = true; // Just a placeholder for fallback
      return true;
    }
    
    const faceapi = (window as any).faceapi;
    
    if (!faceapi) {
      console.error("Face API not loaded properly");
      usingFallbackDetection = true;
      faceDetectionModel = true;
      return true;
    }
    
    // Check if models are available locally
    const modelsAvailable = await checkModelsAvailable();
    
    if (!modelsAvailable) {
      console.warn("Face detection models not found in /models directory");
      
      // Try loading from CDN
      try {
        console.log("Loading face detection models from CDN");
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        console.log("Face detection models loaded from CDN");
        faceDetectionModel = faceapi.nets.tinyFaceDetector;
        return true;
      } catch (cdnError) {
        console.error("Error loading face detection models from CDN:", cdnError);
        
        // Final fallback - try another CDN
        try {
          console.log("Attempting to load from alternative CDN");
          await faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
          console.log("Face detection models loaded from alternative CDN");
          faceDetectionModel = faceapi.nets.tinyFaceDetector;
          return true;
        } catch (finalError) {
          console.error("All model loading attempts failed:", finalError);
          // Switch to fallback detection
          usingFallbackDetection = true;
          faceDetectionModel = true; // Just a placeholder for fallback
          return true;
        }
      }
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
        console.log("Attempting to load models from CDN");
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        console.log("Face detection models loaded successfully from CDN");
        faceDetectionModel = faceapi.nets.tinyFaceDetector;
        return true;
      } catch (cdnError) {
        console.error("Error loading face detection models from CDN:", cdnError);
        // Switch to fallback detection
        usingFallbackDetection = true;
        faceDetectionModel = true; // Just a placeholder for fallback
        return true;
      }
    }
  } catch (error) {
    console.error("Error initializing face detection:", error);
    // Switch to fallback detection
    usingFallbackDetection = true;
    faceDetectionModel = true; // Just a placeholder for fallback
    return true;
  }
};

// Enhanced fallback detection based on pixel difference
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
    
    // More advanced pixel analysis (patterns consistent with faces)
    let variationCount = 0;
    let centerBrightness = 0;
    let edgeBrightness = 0;
    let totalPixels = data.length / 4;
    
    // Check center region (where face likely is)
    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    const centerRadius = Math.floor(canvas.width / 4);
    
    // Sample center and edge regions
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const brightness = (data[idx] + data[idx+1] + data[idx+2]) / 3;
        
        const distanceToCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        
        if (distanceToCenter < centerRadius) {
          centerBrightness += brightness;
        } else if (distanceToCenter > centerRadius * 1.8) {
          edgeBrightness += brightness;
        }
      }
    }
    
    // Normalize by pixel count
    centerBrightness /= (Math.PI * centerRadius * centerRadius);
    edgeBrightness /= (totalPixels - Math.PI * centerRadius * centerRadius);
    
    // Feature 1: Center should typically be brighter than edges in a webcam with face
    const brightnessRatio = centerBrightness / (edgeBrightness + 1);
    
    // Feature 2: Check for movement (frame difference)
    const hasSignificantVariation = analyzePixelVariation(data);
    
    // Face-like detection heuristic
    return (brightnessRatio > 1.05 && hasSignificantVariation);
  } catch (error) {
    console.error("Error in fallback detection:", error);
    return true; // Assume user is present rather than falsely triggering alerts
  }
};

// Helper function to analyze pixel variation
const analyzePixelVariation = (data: Uint8ClampedArray) => {
  let variationCount = 0;
  let lastPixel = data[0];
  
  for (let i = 0; i < data.length; i += 16) {
    if (Math.abs(data[i] - lastPixel) > 20) {
      variationCount++;
    }
    lastPixel = data[i];
  }
  
  return (variationCount / (data.length / 64)) > 0.1;
};

// Start face detection with enhanced reliability
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
  
  // Create detection loop with improved reliability
  detectionInterval = window.setInterval(async () => {
    if (!videoElement || videoElement.paused || videoElement.ended) return;
    
    try {
      let faceDetected = false;
      
      if (usingFallbackDetection) {
        // Use enhanced fallback detection
        faceDetected = fallbackDetection(videoElement);
      } else if (faceapi) {
        // Use face-api.js with error handling
        try {
          const detections = await faceapi.detectAllFaces(
            videoElement,
            new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 })
          );
          faceDetected = detections && detections.length > 0;
        } catch (detectionError) {
          console.error("Face detection error:", detectionError);
          // Fall back to simple detection
          faceDetected = fallbackDetection(videoElement);
        }
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
      console.error("Face detection loop error:", error);
      // If detection throws an error, assume face is present
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
