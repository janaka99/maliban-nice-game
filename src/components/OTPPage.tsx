"use client";
import React, { useState } from "react";
import OTPForm from "./forms/OTPForm";
import PhoneNumberForm from "./forms/PhoneNumberForm";

type Props = {
  language?: string;
};

export default function OTPPage({ language }: Props) {
  const [currentStep, setCurrentStep] = useState<"phone" | "otp">("phone");

  return (
    <div className="min-h-[100svh] w-full flex justify-center items-center">
      {currentStep === "phone" ? (
        <PhoneNumberForm setCurrentStep={setCurrentStep} />
      ) : (
        <OTPForm />
      )}
    </div>
  );
}
