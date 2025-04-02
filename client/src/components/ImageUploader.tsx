import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Super simplified component with minimal dependencies
interface ImageUploaderProps {
  onImageUploaded: (imageId: number, imageUrl: string) => void;
  onContinue: () => void;
}

export function ImageUploader({ onImageUploaded, onContinue }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [imageId, setImageId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // When upload succeeds, notify parent component
  useEffect(() => {
    if (uploadSuccess && imageId && imageUrl) {
      onImageUploaded(imageId, imageUrl);
    }
  }, [uploadSuccess, imageId, imageUrl, onImageUploaded]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    setUploading(true);
    setErrorMessage(null);
    
    try {
      const formElement = event.currentTarget;
      const formData = new FormData(formElement);
      
      // Get the file input from the form
      const fileInput = formElement.querySelector('input[type="file"]') as HTMLInputElement;
      if (!fileInput?.files || fileInput.files.length === 0) {
        setErrorMessage("Please select a file");
        setUploading(false);
        return;
      }
      
      // Simple manual validation
      const file = fileInput.files[0];
      if (!file.type || !["image/jpeg", "image/png"].includes(file.type)) {
        setErrorMessage("Please upload a JPEG or PNG image");
        setUploading(false);
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setErrorMessage("File size must be less than 10MB");
        setUploading(false);
        return;
      }
      
      // Upload using basic fetch instead of tanstack-query to minimize dependencies
      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Set states on success
      setImageId(data.id);
      setImageUrl(`/api/images/file/${data.fileName}`);
      setUploadSuccess(true);
      
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown upload error");
    } finally {
      setUploading(false);
    }
  }
  
  return (
    <div className="text-gray-200">
      <h1 className="text-2xl font-bold mb-6">Upload Your Image</h1>
      <p className="mb-6 text-gray-400">
        Upload a high-quality image to create your custom print. We support JPG and PNG formats.
      </p>
      
      {!uploadSuccess ? (
        <form onSubmit={handleSubmit} className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center bg-gray-900">
          <div className="mb-6">
            <p className="text-lg font-medium mb-2">Select an image to upload</p>
            <p className="text-sm text-gray-400 mb-4">JPG or PNG, max 10MB</p>
            
            <input 
              type="file" 
              name="image" 
              accept="image/jpeg, image/png"
              className="w-full max-w-md mx-auto border border-gray-700 rounded p-2 bg-gray-800 text-gray-300"
              required
            />
          </div>
          
          {errorMessage && (
            <div className="my-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-400">
              {errorMessage}
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={uploading}
            className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50 mt-2"
          >
            {uploading ? <LoadingSpinner size="sm" color="white" /> : 'Upload Image'}
          </Button>
        </form>
      ) : (
        <div className="text-center">
          <div className="p-4 bg-green-900/30 border border-green-700 rounded mb-6">
            Image uploaded successfully! Click Continue to proceed to the next step.
          </div>
          
          <div className="max-w-sm mx-auto mb-6 bg-gray-800 p-2 rounded">
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="Uploaded preview" 
                className="max-h-64 mx-auto object-contain"
              />
            )}
          </div>
          
          <Button 
            onClick={onContinue}
            className="btn-glow"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
