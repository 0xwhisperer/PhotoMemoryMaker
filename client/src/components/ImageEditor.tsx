import { useState } from "react";
import { FilterType } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FILTERS } from "@/lib/utils";

interface ImageEditorProps {
  imageUrl: string;
  onBack: () => void;
  onContinue: (rotation: number, filter: FilterType) => void;
}

export function ImageEditor({ imageUrl, onBack, onContinue }: ImageEditorProps) {
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
      <h1 className="text-2xl font-bold mb-6">Edit Your Image</h1>
      <p className="mb-6 text-gray-600">
        Make adjustments to your image before printing.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Preview */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
          <div
            className="relative overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center"
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
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-medium text-gray-800 mb-3">Rotation</h2>
            <div className="flex justify-between">
              <Button
                variant="outline"
                className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={rotateLeft}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <span className="text-sm font-medium">{rotation}°</span>
              <Button
                variant="outline"
                className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={rotateRight}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-medium text-gray-800 mb-3">Filter</h2>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(FILTERS).map(([filterValue, filterName]) => (
                <button
                  key={filterValue}
                  onClick={() => setFilter(filterValue as FilterType)}
                  className={`p-2 rounded-md text-center text-sm ${
                    filter === filterValue
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {filterName}
                </button>
              ))}
            </div>
          </div>

          {/* Cropping Notice */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="font-medium text-gray-800 mb-2">Crop Tool</h2>
            <p className="text-sm text-gray-600">
              For advanced cropping options, continue to the next step where you
              can select your product and adjust the crop accordingly.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </div>
  );
}
