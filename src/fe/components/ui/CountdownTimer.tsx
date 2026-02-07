"use client";

import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  seconds: number;
  onComplete?: () => void;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  seconds,
  onComplete,
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className={`text-sm font-mono ${className}`}>
      {minutes}:{secs.toString().padStart(2, "0")}
    </div>
  );
};
