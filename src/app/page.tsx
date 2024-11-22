"use client";
import Landing from "@/components/Landing";
import OTPPage from "@/components/OTPPage";
import { useLanguage } from "@/context/language/LanguageContext";
import { useMultistepFormContext } from "@/context/steps/multistepsContext";

import Image from "next/image";

export default function Home() {
  const { language, setLanguage } = useLanguage();

  const { step, goNext, goBack, goTo, currentStepIndex } =
    useMultistepFormContext();

  return <div className="">{step}</div>;
}
