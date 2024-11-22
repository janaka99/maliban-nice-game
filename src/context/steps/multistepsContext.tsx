"use client";
import FormPage from "@/components/FormPage";
import Landing from "@/components/Landing";
import OTPPage from "@/components/OTPPage";
import UserImages from "@/components/UserImages";
import {
  createContext,
  useContext,
  ReactElement,
  useState,
  ReactNode,
} from "react";

// Define the type for the context state
interface MultistepFormContextType {
  currentStepIndex: number;
  step: ReactElement;
  goTo: (index: number) => void;
  goNext: () => void;
  goBack: () => void;
  GoToImageGeneratePage: () => void;
}

const MultistepFormContext = createContext<
  MultistepFormContextType | undefined
>(undefined);

const steps: ReactElement[] = [
  <Landing />,
  <OTPPage />,
  <FormPage />,
  <UserImages />,
];

interface MultistepFormProviderProps {
  children: ReactNode;
  initialStepIndex?: number;
}

export function MultistepFormProvider({
  children,
  initialStepIndex = 2,
}: MultistepFormProviderProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);

  function goNext() {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  }

  function GoToImageGeneratePage() {
    setCurrentStepIndex(2);
  }

  function goBack() {
    setCurrentStepIndex((i) => {
      if (i <= 0) return i; // Fixed the error here to prevent negative index
      return i - 1;
    });
  }

  function goTo(index: number) {
    setCurrentStepIndex(index);
  }

  const value = {
    currentStepIndex,
    step: steps[currentStepIndex],
    goTo,
    goNext,
    goBack,
    GoToImageGeneratePage,
  };

  return (
    <MultistepFormContext.Provider value={value}>
      {children}
    </MultistepFormContext.Provider>
  );
}

// Custom hook to use the multistep form context
export function useMultistepFormContext() {
  const context = useContext(MultistepFormContext);

  if (!context) {
    throw new Error(
      "useMultistepFormContext must be used within a MultistepFormProvider"
    );
  }

  return context;
}
