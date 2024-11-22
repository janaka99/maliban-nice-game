"use client";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  isLoading: boolean;
  text: string;
  className?: string;
  disabled?: boolean;
};

export default function SubmitButton({
  isLoading,
  text,
  className = "",
  disabled = false,
}: Props) {
  return (
    <Button
      className={twMerge(
        "min-w-[200px] w-full bg-malibanYellow hover:bg-yellow-400 text-malibanBlue uppercase font-black tracking-widest italic",
        className
      )}
      disabled={disabled ? disabled : isLoading}
    >
      {isLoading ? <LoaderCircle className="animate-spin" /> : text}
    </Button>
  );
}
