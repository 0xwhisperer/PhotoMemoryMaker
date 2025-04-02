import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UploadCloud, X } from "lucide-react";

interface ImageUploaderProps {
  onImageUploaded: (imageId: number, imageUrl: string) => void;
  onContinue: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png"];

export function ImageUploader({ onImageUploaded, onContinue }: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file, file.name);

      const response = await apiRequest("POST", "/api/images/upload", undefined, {
        body: formData,
        headers: {},
      });

      return response.json();
    },
    onSuccess: (data) => {
      const imageUrl = `/api/images/file/${data.fileName}`;
      onImageUploaded(data.id, imageUrl);
      toast({
        title: "Image uploaded successfully",
        description: "Your image is ready to be edited",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // Reset previous selection
      setImagePreview(null);
      setSelectedFile(null);
      
      // Check if there are any files selected
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type || !ACCEPTED_FILE_TYPES.includes(file.type)) {
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
      
      // Store the selected file
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error handling file:", error);
      toast({
        title: "Error processing file",
        description: "An unexpected error occurred while processing the file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const resetImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-200">Upload Your Image</h1>
      <p className="mb-6 text-gray-400">
        Upload a high-quality image to create your custom print. We support JPG and PNG formats.
      </p>

      {!imagePreview ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center transition duration-150 flex flex-col items-center justify-center border-gray-700 hover:border-primary bg-gray-900">
          <UploadCloud className="h-12 w-12 text-gray-500 mb-4" />
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
          <div className="relative overflow-hidden rounded-lg shadow-lg card-dark">
            <img
              src={imagePreview}
              alt="Selected image preview"
              className="w-full h-auto max-h-96 object-contain bg-gray-800"
            />
            <Button
              onClick={resetImage}
              className="absolute top-2 right-2 bg-gray-800 text-red-400 p-1 rounded-full hover:bg-gray-700 focus:outline-none h-8 w-8 border border-red-600"
              size="icon"
              variant="destructive"
              disabled={uploadMutation.isPending}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {!uploadMutation.isPending && !uploadMutation.isSuccess && (
            <div className="flex justify-center mt-4">
              <Button 
                onClick={handleUpload}
                className="btn-glow"
              >
                Upload Image
              </Button>
            </div>
          )}
        </div>
      )}

      {uploadMutation.isPending && (
        <div className="mt-4 text-center">
          <LoadingSpinner className="mx-auto" />
          <p className="mt-2 text-sm text-gray-400">Uploading your image...</p>
        </div>
      )}

      {uploadMutation.isError && (
        <Card className="mt-4 bg-gray-800 border-red-800 text-red-400">
          <CardContent className="pt-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{uploadMutation.error.message || "Upload failed. Please try again."}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end mt-6">
        <Button
          onClick={onContinue}
          disabled={!uploadMutation.isSuccess}
          className={`btn-glow ${!uploadMutation.isSuccess ? 'opacity-50' : ''}`}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
