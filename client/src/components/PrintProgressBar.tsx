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
    <div className="bg-white py-4 shadow-sm border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {PRINT_STEPS.map((step, index) => (
            <>
              <div className="flex flex-col items-center" key={step.id}>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    currentStep >= step.id
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  )}
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
              </div>
              {index < PRINT_STEPS.length - 1 && (
                <div
                  key={`connector-${step.id}`}
                  className={cn(
                    "h-0.5 w-full max-w-12 mx-2",
                    currentStep > step.id ? "bg-primary" : "bg-gray-200"
                  )}
                ></div>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
