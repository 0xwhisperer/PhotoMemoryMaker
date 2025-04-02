import React from "react";
import { cn } from "@/lib/utils";

type PrintStep = {
  id: number;
  name: string;
};

const PRINT_STEPS: PrintStep[] = [
  { id: 1, name: "Upload" },
  { id: 2, name: "Edit" },
  { id: 3, name: "Product" },
  { id: 4, name: "Checkout" },
];

interface PrintProgressBarProps {
  currentStep: number;
}

export function PrintProgressBar({ currentStep }: PrintProgressBarProps) {
  return (
    <div className="bg-gray-900 py-4 shadow-md border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {PRINT_STEPS.map((step, index) => [
            <div className="flex flex-col items-center" key={`step-${step.id}`}>
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                  currentStep >= step.id
                    ? "bg-primary text-white shadow-glow"
                    : "bg-gray-800 text-gray-500 border border-gray-700"
                )}
                style={currentStep >= step.id ? { boxShadow: '0 0 10px rgba(0, 191, 255, 0.5)' } : {}}
              >
                {step.id}
              </div>
              <span
                className={cn(
                  "text-xs mt-1",
                  currentStep >= step.id
                    ? "text-primary font-medium"
                    : "text-gray-500"
                )}
              >
                {step.name}
              </span>
            </div>,
            index < PRINT_STEPS.length - 1 && (
              <div
                key={`connector-${step.id}`}
                className={cn(
                  "h-0.5 w-full max-w-12 mx-2",
                  currentStep > step.id ? "bg-primary" : "bg-gray-700"
                )}
              ></div>
            )
          ].filter(Boolean))}
        </div>
      </div>
    </div>
  );
}
