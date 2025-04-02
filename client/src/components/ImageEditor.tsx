import { useState } from "react";
import { FilterType } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FILTERS } from "@/lib/utils";

interface ImageEditorProps {
  imageUrl: string;
  onBack: () => void;
  onStartOver: () => void;
  onContinue: (rotation: number, filter: FilterType) => void;
}

export function ImageEditor({ imageUrl, onBack, onStartOver, onContinue }: ImageEditorProps) {
  const [rotation, setRotation] = useState(0);
  const [filter, setFilter] = useState<FilterType>("none");

  const rotateLeft = () => {
    setRotation((prev) => prev - 90);
  };

  const rotateRight = () => {
    setRotation((prev) => prev + 90);
  };

  const handleContinue = () => {
    onContinue(rotation, filter);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-200">Edit Your Image</h1>
      <p className="mb-6 text-gray-400">
        Make adjustments to your image before printing.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Preview */}
        <div className="lg:col-span-2 card-dark rounded-lg shadow-lg p-4">
          <div
            className="relative overflow-hidden rounded-lg bg-gray-800 flex items-center justify-center"
            style={{ minHeight: "400px" }}
          >
            <img
              src={imageUrl}
              alt="Image preview"
              className="max-w-full max-h-80 object-contain transition-all duration-300"
              style={{ transform: `rotate(${rotation}deg)`, filter }}
            />
          </div>
        </div>

        {/* Edit Controls */}
        <div className="space-y-6">
          {/* Rotation */}
          <div className="card-dark p-4 rounded-lg shadow-lg">
            <h2 className="font-medium text-gray-200 mb-3">Rotation</h2>
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                className="p-2 bg-gray-800 border-gray-700 text-gray-300 rounded-md hover:bg-gray-700"
                onClick={rotateLeft}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <span className="text-sm font-medium text-gray-300">{rotation}°</span>
              <Button
                variant="outline"
                className="p-2 bg-gray-800 border-gray-700 text-gray-300 rounded-md hover:bg-gray-700"
                onClick={rotateRight}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="card-dark p-4 rounded-lg shadow-lg">
            <h2 className="font-medium text-gray-200 mb-3">Filter</h2>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(FILTERS).map(([filterValue, filterName]) => (
                <button
                  key={filterValue}
                  onClick={() => setFilter(filterValue as FilterType)}
                  className={`p-2 rounded-md text-center text-sm transition-colors duration-200 ${
                    filter === filterValue
                      ? "bg-gray-800 text-primary border border-primary"
                      : "bg-gray-900 text-gray-300 border border-gray-800 hover:bg-gray-800 hover:text-gray-200"
                  }`}
                >
                  {filterName}
                </button>
              ))}
            </div>
          </div>

          {/* Cropping Notice */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h2 className="font-medium text-gray-200 mb-2">Crop Tool</h2>
            <p className="text-sm text-gray-400">
              For advanced cropping options, continue to the next step where you
              can select your product and adjust the crop accordingly.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={onBack}
            className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
          >
            Back
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onStartOver} 
            className="text-gray-400 hover:text-gray-200"
          >
            Start Over
          </Button>
        </div>
        <Button 
          onClick={handleContinue}
          className="btn-glow"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
