
import { toast } from "sonner";

// Function to download and save the face-api.js models
export const downloadFaceModels = async () => {
  const modelUrls = [
    'https://github.com/justadudewhohacks/face-api.js/raw/master/weights/tiny_face_detector_model-weights_manifest.json',
    'https://github.com/justadudewhohacks/face-api.js/raw/master/weights/tiny_face_detector_model-shard1',
    // Adding additional model files that might be needed
    'https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-weights_manifest.json',
    'https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-shard1',
    'https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-weights_manifest.json',
    'https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-shard1',
    'https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-shard2',
  ];
  
  try {
    // Load JSZip if needed
    await loadJSZip();
    
    toast.info("Downloading face detection models...");
    
    // Create a zip file with models for download
    const zip = new (window as any).JSZip();
    const modelsFolder = zip.folder("models");
    
    // Download each model file
    const downloadPromises = modelUrls.map(async (url) => {
      const fileName = url.split('/').pop() as string;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download model file: ${fileName}`);
      }
      const blob = await response.blob();
      modelsFolder?.file(fileName, blob);
      return fileName;
    });
    
    try {
      // Wait for all downloads to complete
      await Promise.all(downloadPromises);
      
      // Generate zip file and create download link
      const content = await zip.generateAsync({ type: "blob" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = "face-models.zip";
      
      toast.success("Models downloaded. Please follow these steps:", {
        description: "1. Extract the ZIP file\n2. Place the 'models' folder in your 'public' directory\n3. Reload the app",
        duration: 10000,
      });
      
      // Trigger download
      downloadLink.click();
      return true;
    } catch (error) {
      console.error("Error processing downloads:", error);
      toast.error("Failed to download face detection models");
      return false;
    }
    
  } catch (error) {
    console.error("Error downloading face detection models:", error);
    toast.error("Failed to download face detection models");
    return false;
  }
};

// Check if JSZip is available, if not load it
export const loadJSZip = async () => {
  if (typeof (window as any).JSZip !== 'undefined') {
    return Promise.resolve();
  }
  
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load JSZip'));
    document.head.appendChild(script);
  });
};
