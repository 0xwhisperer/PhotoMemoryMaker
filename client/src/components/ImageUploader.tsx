import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UploadCloud, X } from "lucide-react";

interface ImageUploaderProps {
  onImageUploaded: (imageId: number, imageUrl: string) => void;
  onContinue: () => void;
}

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png"];

export function ImageUploader({ onImageUploaded, onContinue }: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedImageId, setUploadedImageId] = useState<number | null>(null);
  const { toast } = useToast();

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Reset previous selection
    setImagePreview(null);
    setSelectedFile(null);
    
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG or PNG image",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result) {
        setImagePreview(result.toString());
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image file first",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      
      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      const imageUrl = `/api/images/file/${data.fileName}`;
      
      setUploadedImageId(data.id);
      setUploadedImageUrl(imageUrl);
      setUploadSuccess(true);
      
      // Notify parent component
      onImageUploaded(data.id, imageUrl);
      
      toast({
        title: "Image uploaded successfully",
        description: "Your image is ready to be edited",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Clear selected image
  const resetImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  return (
    <div className="text-gray-200">
      <h1 className="text-2xl font-bold mb-6">Upload Your Image</h1>
      <p className="mb-6 text-gray-400">
        Upload a high-quality image to create your custom print. We support JPG and PNG formats.
      </p>

      {!imagePreview ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center border-gray-700 hover:border-primary bg-gray-900">
          <UploadCloud className="h-12 w-12 text-gray-500 mb-4 mx-auto" />
          <p className="mb-2 text-sm font-medium text-gray-300">
            Select an image to upload
          </p>
          <p className="text-xs text-gray-500 mb-4">JPG or PNG, max 10MB</p>

          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-400
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-medium
                       file:bg-gray-800 file:text-gray-300
                       hover:file:bg-gray-700 hover:file:text-primary
                       file:cursor-pointer file:transition-colors"
          />
        </div>
      ) : (
        <div className="mt-6">
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <img
              src={imagePreview}
              alt="Selected image preview"
              className="w-full h-auto max-h-96 object-contain bg-gray-800"
            />
            <Button
              onClick={resetImage}
              className="absolute top-2 right-2 bg-gray-800 text-red-400 p-1 rounded-full hover:bg-gray-700 h-8 w-8 border border-red-600"
              size="icon"
              variant="destructive"
              disabled={uploading}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {!uploadSuccess && !uploading && (
            <div className="flex justify-center mt-4">
              <Button 
                onClick={handleUpload}
                className="btn-glow"
                disabled={uploading}
              >
                Upload Image
              </Button>
            </div>
          )}
        </div>
      )}

      {uploading && (
        <Card className="mt-4 text-center p-4 bg-gray-800 border-gray-700">
          <LoadingSpinner className="mx-auto" />
          <p className="mt-2 text-sm text-gray-400">Uploading your image...</p>
        </Card>
      )}

      {uploadSuccess && (
        <Card className="mt-4 text-center p-4 bg-gray-800/50 border-green-700/50">
          <p className="text-green-400 mb-4">Image uploaded successfully!</p>
          <Button 
            onClick={onContinue}
            className="btn-glow"
          >
            Continue to Image Editor
          </Button>
        </Card>
      )}
    </div>
  );
}
