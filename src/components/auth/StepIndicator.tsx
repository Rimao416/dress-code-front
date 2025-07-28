// components/auth/registration-steps/StepIndicator.tsx
"use client";
import { motion } from "framer-motion";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= step.id
                  ? "bg-red-800 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
              animate={{
                backgroundColor: currentStep >= step.id ? "#991B1B" : "#E5E7EB",
                color: currentStep >= step.id ? "#FFFFFF" : "#6B7280",
              }}
              transition={{ duration: 0.3 }}
            >
              {step.id}
            </motion.div>
            {index < steps.length - 1 && (
              <motion.div
                className="w-16 h-1 mx-2"
                animate={{
                  backgroundColor:
                    currentStep > step.id ? "#991B1B" : "#E5E7EB",
                }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {steps[currentStep - 1].title}
        </h3>
        <p className="text-sm text-gray-600">
          {steps[currentStep - 1].description}
        </p>
      </div>
    </div>
  );
}
