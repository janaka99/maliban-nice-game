"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

type Props = {
  expireTime: Date;
  setCurrentStep: any;
};

const CountDown = ({ expireTime, setCurrentStep }: Props) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [expired, setExpired] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const currentTime = new Date().getTime();
      const expiryTime = expireTime.getTime();
      const timeDiff = expiryTime - currentTime;

      if (timeDiff <= 0) {
        setExpired(true);
        setTimeLeft(0);
      } else {
        setTimeLeft(Math.floor(timeDiff / 1000)); // Convert to seconds
      }
    };

    // Initialize countdown on component mount
    calculateTimeLeft();

    // Set an interval to update the countdown every second
    const interval = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [expireTime]);
  // Calculate minutes and seconds from the remaining time
  // const minutes = Math.floor(timeLeft / 60);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (expired) {
    return <></>;
  }
  return (
    <div className="text-sm text-white from-black flex gap-5">
      <button
        className="text-white border-none text-sm font-black underline"
        onClick={() => setCurrentStep("otp")}
      >
        Add OTP
      </button>
      {/* Display time in MM:SS format */}
      <div className="">
        {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </div>
    </div>
  );
};

export default CountDown;
