import { ChangeEvent, useCallback, useState } from "react";
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
  const [isDragActive, setIsDragActive] = useState(false);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await apiRequest("POST", "/api/images/upload", null, {
        body: formData,
        headers: {}, // Let the browser set the Content-Type header with the boundary
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

  const handleFileDrop = useCallback(
    (file: File) => {
      if (!file) return;

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

      // Create preview and upload file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        uploadMutation.mutate(file);
      };
      reader.readAsDataURL(file);
    },
    [toast, uploadMutation]
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileDrop(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileDrop(file);
    }
  };

  const resetImage = () => {
    setImagePreview(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Upload Your Image</h1>
      <p className="mb-6 text-gray-600">
        Upload a high-quality image to create your custom print. We support JPG and PNG formats.
      </p>

      {!imagePreview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary transition duration-150 flex flex-col items-center justify-center ${
            isDragActive ? "border-primary" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
          <p className="mb-2 text-sm font-medium text-gray-700">
            Drag and drop your image here
          </p>
          <p className="text-xs text-gray-500">JPG or PNG, max 10MB</p>

          <div className="mt-4 inline-flex rounded-md shadow-sm">
            <label className="py-2 px-4 border border-gray-300 rounded-md text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out cursor-pointer">
              Browse files
              <input
                type="file"
                className="sr-only"
                accept="image/jpeg, image/png"
                onChange={handleInputChange}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="relative overflow-hidden rounded-lg shadow-md">
            <img
              src={imagePreview}
              alt="Uploaded image preview"
              className="w-full h-auto max-h-96 object-contain bg-white"
            />
            <Button
              onClick={resetImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none h-8 w-8"
              size="icon"
              variant="destructive"
              disabled={uploadMutation.isPending}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {uploadMutation.isPending && (
        <div className="mt-4 text-center">
          <LoadingSpinner className="mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Processing your image...</p>
        </div>
      )}

      {uploadMutation.isError && (
        <Card className="mt-4 bg-red-50 border-red-200 text-red-700">
          <CardContent className="pt-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400 mr-2"
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
          disabled={!imagePreview || uploadMutation.isPending}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
