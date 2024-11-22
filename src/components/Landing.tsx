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
      <div className="flex justify-center items-center gap-5">
        <Button
          onClick={() => {
            setLanguage("en");
            goNext();
          }}
          className="bg-yellow-400 hover:bg-yellow-400 text-malibanBlue uppercase font-black tracking-widest italic  "
        >
          Start
        </Button>
      </div>
    </div>
  );
}
// Jnaka@123maliban
