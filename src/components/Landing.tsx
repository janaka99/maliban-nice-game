"use client";
import { useLanguage } from "@/context/language/LanguageContext";
import React, { useContext } from "react";
import { Button } from "./ui/button";
import { useMultistepFormContext } from "@/context/steps/multistepsContext";

type Props = {
  next?: () => void;
};

export default function Landing({ next }: Props) {
  const { language, setLanguage } = useLanguage();

  const { goNext } = useMultistepFormContext();

  return (
    <div className="min-h-[100svh] w-full   flex flex-col justify-center items-center">
      <div className="-mt-10 w-full px-5">
        <img
          src="nice_meter.png"
          alt=""
          className="object-contain w-full max-w-[400px] mx-auto"
        />
      </div>
      <div className="flex gap-5">
        <button
          className="px-4 py-1 text-sm bg-transparent border-2 border-white text-white font-semibold rounded-lg italic"
          onClick={() => {
            setLanguage("sn");
            goNext();
          }}
        >
          Sinhala
        </button>
        <Button
          onClick={() => {
            setLanguage("en");
            goNext();
          }}
          className="px-4 py-1 text-sm bg-transparent border-2 border-white text-white font-semibold rounded-lg italic"
        >
          English
        </Button>
        <Button
          onClick={() => {
            setLanguage("tm");
            goNext();
          }}
          className="px-4 py-1 text-sm bg-transparent border-2 border-white text-white font-semibold rounded-lg italic"
        >
          Tamil
        </Button>
      </div>
    </div>
  );
}
// Jnaka@123maliban
